import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { sendTelegramAlert } from './notify-telegram';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface WatchlistItem {
  id: string;
  user_id: string;
  name: string;
  url: string;
  is_active: boolean;
  status: string;
}

function generateHash(url: string, title: string): string {
  return crypto.createHash('md5').update(`${url}:${title}`).digest('hex');
}

async function scrapeFacebookUrl(url: string): Promise<{ listings: any[]; blocked: boolean; error?: string }> {
  try {
    // Add random delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const html = response.data;

    // Check for login/block indicators
    if (
      html.includes('login') ||
      html.includes('Log In') ||
      html.includes('captcha') ||
      html.includes('checkpoint') ||
      response.status === 403 ||
      response.status === 429
    ) {
      return {
        listings: [],
        blocked: true,
        error: 'Facebook requires login or blocked by anti-bot measures',
      };
    }

    const $ = cheerio.load(html);
    const listings: any[] = [];

    // Best-effort parsing (Facebook HTML is heavily obfuscated)
    // This is a simplified approach and may not work reliably
    $('a[href*="/marketplace/item/"]').each((_, element) => {
      try {
        const $el = $(element);
        const href = $el.attr('href');
        
        if (!href) return;

        const fullUrl = href.startsWith('http') ? href : `https://www.facebook.com${href}`;
        
        // Try to extract text content
        const text = $el.text().trim();
        
        if (text && fullUrl) {
          listings.push({
            title: text.substring(0, 200), // Limit length
            source_url: fullUrl.split('?')[0], // Remove query params
            raw: {
              scrapedAt: new Date().toISOString(),
              originalUrl: url,
            },
          });
        }
      } catch (err) {
        console.error('Error parsing FB element:', err);
      }
    });

    // Deduplicate by URL
    const uniqueListings = Array.from(
      new Map(listings.map(l => [l.source_url, l])).values()
    );

    return {
      listings: uniqueListings,
      blocked: false,
    };
  } catch (error: any) {
    console.error('Error scraping Facebook:', error.message);

    // Check if it's a blocking error
    if (
      error.response?.status === 403 ||
      error.response?.status === 429 ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('timeout')
    ) {
      return {
        listings: [],
        blocked: true,
        error: error.message,
      };
    }

    return {
      listings: [],
      blocked: false,
      error: error.message,
    };
  }
}

export async function scanFacebookWatchlist() {
  console.log('Starting Facebook watchlist scan...');

  try {
    // Get all active watchlist items
    const { data: watchlist, error: watchlistError } = await supabase
      .from('motoscout_facebook_watchlist')
      .select('*')
      .eq('is_active', true);

    if (watchlistError) throw watchlistError;

    if (!watchlist || watchlist.length === 0) {
      console.log('No active watchlist items found');
      return { scanned: 0, newListings: 0, blocked: 0 };
    }

    console.log(`Found ${watchlist.length} active watchlist items`);

    let totalNewListings = 0;
    let totalBlocked = 0;

    for (const item of watchlist as WatchlistItem[]) {
      console.log(`Processing watchlist: ${item.name}`);

      const result = await scrapeFacebookUrl(item.url);

      // Update watchlist status
      if (result.blocked) {
        console.log(`Watchlist blocked: ${item.name}`);
        totalBlocked++;

        await supabase
          .from('motoscout_facebook_watchlist')
          .update({
            status: 'BLOCKED',
            last_error: result.error || 'Access blocked by Facebook',
            last_checked_at: new Date().toISOString(),
          })
          .eq('id', item.id);
      } else {
        await supabase
          .from('motoscout_facebook_watchlist')
          .update({
            status: 'OK',
            last_error: null,
            last_checked_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        console.log(`Found ${result.listings.length} listings`);

        for (const listing of result.listings) {
          const hash = generateHash(listing.source_url, listing.title);

          const listingData = {
            user_id: item.user_id,
            source: 'FACEBOOK',
            source_url: listing.source_url,
            title: listing.title,
            currency: 'AED',
            hash,
            raw: listing.raw,
          };

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
              url: listing.source_url,
              source: 'Facebook Marketplace',
              searchName: item.name,
            });
          }
        }
      }

      // Rate limiting between items
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log(
      `Facebook scan complete. New listings: ${totalNewListings}, Blocked: ${totalBlocked}`
    );
    return {
      scanned: watchlist.length,
      newListings: totalNewListings,
      blocked: totalBlocked,
    };
  } catch (error: any) {
    console.error('Facebook scan error:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  scanFacebookWatchlist()
    .then(result => {
      console.log('Scan result:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
