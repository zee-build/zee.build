import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { sendTelegramAlert } from './notify-telegram';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  brand?: string;
  model?: string;
  keywords?: string;
  max_price?: number;
  min_year?: number;
  location?: string;
  sources: { dubizzle?: boolean };
}

interface Listing {
  user_id: string;
  source: string;
  source_url: string;
  title: string;
  price?: number;
  currency: string;
  location_text?: string;
  year?: number;
  image_url?: string;
  posted_at?: string;
  hash: string;
  raw: any;
}

function buildDubizzleUrl(search: SavedSearch): string {
  const baseUrl = 'https://dubai.dubizzle.com/motors/used-cars';
  const params = new URLSearchParams();

  if (search.brand) params.append('make', search.brand);
  if (search.model) params.append('model', search.model);
  if (search.keywords) params.append('keywords', search.keywords);
  if (search.max_price) params.append('price_max', search.max_price.toString());
  if (search.min_year) params.append('year_min', search.min_year.toString());

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

function generateHash(url: string, title: string): string {
  return crypto.createHash('md5').update(`${url}:${title}`).digest('hex');
}

async function scrapeDubizzle(url: string): Promise<any[]> {
  try {
    // Add random delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const listings: any[] = [];

    // Dubizzle listing selectors (may need adjustment based on actual HTML)
    $('[data-testid="listing-card"], .listing-card, article').each((_, element) => {
      try {
        const $el = $(element);
        
        const title = $el.find('h2, .listing-title, [data-testid="listing-title"]').first().text().trim();
        const priceText = $el.find('.price, [data-testid="listing-price"]').first().text().trim();
        const link = $el.find('a').first().attr('href');
        const imageUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const location = $el.find('.location, [data-testid="listing-location"]').first().text().trim();

        if (!title || !link) return;

        // Parse price
        const priceMatch = priceText.match(/[\d,]+/);
        const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : undefined;

        // Parse year from title if present
        const yearMatch = title.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? parseInt(yearMatch[0]) : undefined;

        const fullUrl = link.startsWith('http') ? link : `https://dubai.dubizzle.com${link}`;

        listings.push({
          title,
          price,
          currency: 'AED',
          source_url: fullUrl,
          location_text: location || undefined,
          year,
          image_url: imageUrl,
          raw: {
            priceText,
            scrapedAt: new Date().toISOString(),
          },
        });
      } catch (err) {
        console.error('Error parsing listing element:', err);
      }
    });

    return listings;
  } catch (error: any) {
    console.error('Error scraping Dubizzle:', error.message);
    return [];
  }
}

export async function scanDubizzle() {
  console.log('Starting Dubizzle scan...');

  try {
    // Get all active saved searches with Dubizzle enabled
    const { data: searches, error: searchError } = await supabase
      .from('motoscout_saved_searches')
      .select('*')
      .eq('is_active', true);

    if (searchError) throw searchError;

    if (!searches || searches.length === 0) {
      console.log('No active searches found');
      return { scanned: 0, newListings: 0 };
    }

    const dubizzleSearches = searches.filter(
      (s: SavedSearch) => s.sources?.dubizzle === true
    );

    console.log(`Found ${dubizzleSearches.length} active Dubizzle searches`);

    let totalNewListings = 0;

    for (const search of dubizzleSearches) {
      console.log(`Processing search: ${search.name}`);
      
      const searchUrl = buildDubizzleUrl(search);
      console.log(`URL: ${searchUrl}`);

      const scrapedListings = await scrapeDubizzle(searchUrl);
      console.log(`Found ${scrapedListings.length} listings`);

      for (const listing of scrapedListings) {
        const hash = generateHash(listing.source_url, listing.title);

        const listingData: Listing = {
          user_id: search.user_id,
          source: 'DUBIZZLE',
          source_url: listing.source_url,
          title: listing.title,
          price: listing.price,
          currency: listing.currency,
          location_text: listing.location_text,
          year: listing.year,
          image_url: listing.image_url,
          hash,
          raw: listing.raw,
        };

        // Try to insert (will fail silently if duplicate due to unique constraint)
        const { data: inserted, error: insertError } = await supabase
          .from('motoscout_listings')
          .insert(listingData)
          .select()
          .single();

        if (inserted && !insertError) {
          console.log(`New listing: ${listing.title}`);
          totalNewListings++;

          // Send Telegram alert
          await sendTelegramAlert({
            title: listing.title,
            price: listing.price,
            currency: listing.currency,
            url: listing.source_url,
            source: 'Dubizzle',
            searchName: search.name,
          });
        }
      }

      // Rate limiting between searches
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`Dubizzle scan complete. New listings: ${totalNewListings}`);
    return { scanned: dubizzleSearches.length, newListings: totalNewListings };
  } catch (error: any) {
    console.error('Dubizzle scan error:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  scanDubizzle()
    .then(result => {
      console.log('Scan result:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
