import { scanDubizzle } from './scan-dubizzle';
import { scanFacebookWatchlist } from './scan-facebook-watchlist';

async function scanAll() {
  console.log('=== MotoScout Scanner Started ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const results = {
    dubizzle: { scanned: 0, newListings: 0 },
    facebook: { scanned: 0, newListings: 0, blocked: 0 },
    totalNewListings: 0,
  };

  try {
    // Run Dubizzle scan
    console.log('\n--- Dubizzle Scan ---');
    results.dubizzle = await scanDubizzle();

    // Run Facebook scan
    console.log('\n--- Facebook Scan ---');
    results.facebook = await scanFacebookWatchlist();

    results.totalNewListings = results.dubizzle.newListings + results.facebook.newListings;

    console.log('\n=== Scan Complete ===');
    console.log('Summary:');
    console.log(`  Dubizzle: ${results.dubizzle.newListings} new listings from ${results.dubizzle.scanned} searches`);
    console.log(`  Facebook: ${results.facebook.newListings} new listings from ${results.facebook.scanned} watchlist items (${results.facebook.blocked} blocked)`);
    console.log(`  Total: ${results.totalNewListings} new listings`);

    return results;
  } catch (error: any) {
    console.error('Scan failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  scanAll()
    .then(results => {
      console.log('\nFinal results:', JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { scanAll };
