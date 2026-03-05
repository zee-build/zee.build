import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkMotoScoutAccess } from '@/lib/motoscout/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed, user } = await checkMotoScoutAccess();
    if (!allowed || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const favoritesOnly = searchParams.get('favoritesOnly') === 'true';
    const hideIgnored = searchParams.get('hideIgnored') === 'true';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const recency = searchParams.get('recency'); // '24h', '7d', '30d'

    let query = supabase
      .from('motoscout_listings')
      .select(`
        *,
        actions:motoscout_listing_actions(*)
      `)
      .eq('user_id', user.id);

    if (source) {
      query = query.eq('source', source.toUpperCase());
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (recency) {
      const now = new Date();
      let cutoff = new Date();
      
      switch (recency) {
        case '24h':
          cutoff.setHours(now.getHours() - 24);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
      }
      
      query = query.gte('fetched_at', cutoff.toISOString());
    }

    query = query.order('fetched_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Filter by favorites/ignored in memory (since it's in related table)
    let listings = data || [];
    
    if (favoritesOnly) {
      listings = listings.filter(l => 
        l.actions && l.actions.length > 0 && l.actions[0].is_favorite
      );
    }

    if (hideIgnored) {
      listings = listings.filter(l => 
        !l.actions || l.actions.length === 0 || !l.actions[0].is_ignored
      );
    }

    return NextResponse.json({ listings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
