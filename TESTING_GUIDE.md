# 🧪 Testing Guide - zee.build

Your dev server is running at: **http://localhost:3001**

---

## Quick Test Checklist

### 1. Home Page Test
**URL:** http://localhost:3001/

**What to check:**
- [ ] Page loads without errors
- [ ] "Enter the Lab" button works → goes to /builds
- [ ] NutriNest card is clickable → goes to /builds/nutrinest
- [ ] LinkedIn button opens in new tab
- [ ] Animations are smooth (hero parallax, gooey text)

---

### 2. Builds Page Test
**URL:** http://localhost:3001/builds

**What to check:**
- [ ] Page loads without errors
- [ ] All 4 project cards display
- [ ] NutriNest card is clickable → goes to /builds/nutrinest
- [ ] System log ticker animates
- [ ] Stats dashboard displays correctly

---

### 3. NutriNest Build Page Test ⭐ (Main Focus)
**URL:** http://localhost:3001/builds/nutrinest

**What to check:**
- [ ] Page loads without errors
- [ ] Hero section with shader animation displays
- [ ] All 4 screen images load:
  - Intelligent Home Feed (screen.png)
  - AI Pantry Search (screen1.png)
  - Child Nutrition Profile (screen2.png)
  - The NutriNest Ecosystem (collage.png)
- [ ] Click any image → Modal opens with full-size view
- [ ] Modal navigation (Previous/Next buttons) works
- [ ] Close modal (X button or click outside) works
- [ ] Scroll down to waitlist form section
- [ ] "Join Early Access" button → goes to /nutrinest

---

### 4. Waitlist Form Test ⭐⭐ (Critical)
**URL:** http://localhost:3001/builds/nutrinest (scroll to bottom)

#### Test A: Valid Submission ✅
1. Enter email: `test@example.com`
2. Select child age: `18 months`
3. Select location: `UAE`
4. Click "Join Waitlist"
5. **Expected:** 
   - Loading spinner appears
   - Success message shows: "You're on the list! ✅"
   - Confetti animation plays
   - Email is displayed in success message

#### Test B: Invalid Email ❌
1. Enter email: `invalid-email`
2. Click "Join Waitlist"
3. **Expected:** 
   - Error message: "Please provide a valid email address."
   - No network request made

#### Test C: Empty Email ❌
1. Leave email field empty
2. Click "Join Waitlist"
3. **Expected:** 
   - Browser validation prevents submission
   - Button may be disabled

#### Test D: Check Google Sheets 📊
After successful submission:
1. Go to: https://docs.google.com/forms/d/1FAIpQLScUjv6OEUXEHW7ADAxSRtqmEpPJ46wvCP-gJ7mxEKsmV8aM5Q/edit
2. Click "Responses" tab
3. **Expected:** Your test submission appears in the list
4. Check linked Google Sheet for the data

---

### 5. NutriNest App Page Test
**URL:** http://localhost:3001/nutrinest

**What to check:**
- [ ] Page loads without errors
- [ ] Form renders with all fields
- [ ] Submit form → Success state shows
- [ ] "Return_Home" link → goes to /

---

### 6. About Page Test
**URL:** http://localhost:3001/about

**What to check:**
- [ ] Page loads without errors
- [ ] LinkedIn button works (external link)
- [ ] "Protocol_Builds" button → goes to /builds

---

## Browser Console Check

Open DevTools (F12) and check Console tab:

**Should NOT see:**
- ❌ JavaScript errors
- ❌ React hydration errors
- ❌ 404 errors for images
- ❌ CORS errors

**OK to see:**
- ⚠️ metadataBase warning (non-blocking)
- ℹ️ Analytics logs (console.log statements)

---

## Mobile Responsive Test

### Option 1: Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or "iPad"
4. Test all pages

### Option 2: Real Device
1. Find your computer's IP: `ipconfig` (look for IPv4)
2. On mobile, visit: `http://[YOUR_IP]:3001`
3. Test all pages

**What to check:**
- [ ] Layout adapts to screen size
- [ ] Images scale properly
- [ ] Form inputs are touch-friendly
- [ ] Navigation works on mobile
- [ ] No horizontal scrolling

---

## Network Tab Check

Open DevTools → Network tab:

### When submitting form:
1. Look for request to `/api/waitlist`
2. **Expected:**
   - Method: POST
   - Status: 200 OK
   - Response: `{"success": true, "message": "Successfully joined the waitlist!"}`

### Check images:
1. Filter by "Img"
2. **Expected:**
   - All images return 200 OK
   - No 404 errors

---

## Performance Check

Open DevTools → Lighthouse tab:

1. Select "Desktop"
2. Check "Performance" only
3. Click "Analyze page load"
4. **Target:** Score > 80

---

## Common Issues & Solutions

### Issue: Page shows 500 error
**Solution:** Check server logs in terminal for error details

### Issue: Form submission fails
**Solution:** 
1. Check `.env.local` file exists
2. Verify all GOOGLE_FORM_* variables are set
3. Check server logs for error messages

### Issue: Images don't load
**Solution:** 
1. Verify files exist in `public/builds/nutrinest/`
2. Check browser console for 404 errors
3. Clear browser cache (Ctrl+Shift+R)

### Issue: Modal doesn't open
**Solution:** 
1. Check browser console for JavaScript errors
2. Try refreshing the page
3. Check if framer-motion is installed

---

## Test Results Template

Copy this and fill it out:

```
## Test Results - [Your Name] - [Date]

### Home Page
- [ ] PASS / [ ] FAIL - Notes: ___________

### Builds Page
- [ ] PASS / [ ] FAIL - Notes: ___________

### NutriNest Build Page
- [ ] PASS / [ ] FAIL - Notes: ___________

### Waitlist Form
- [ ] PASS / [ ] FAIL - Notes: ___________
- Google Sheets submission: [ ] VERIFIED / [ ] NOT VERIFIED

### NutriNest App Page
- [ ] PASS / [ ] FAIL - Notes: ___________

### About Page
- [ ] PASS / [ ] FAIL - Notes: ___________

### Console Errors
- [ ] NONE / [ ] FOUND - Details: ___________

### Mobile Responsive
- [ ] PASS / [ ] FAIL - Device: ___________

### Overall
- [ ] READY TO DEPLOY / [ ] NEEDS FIXES
```

---

## Quick Commands

### Restart dev server:
```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

### Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Check server logs:
Look at the terminal where `npm run dev` is running

---

## Need Help?

- **QA Report:** See `QA_REPORT.md` for detailed test results
- **Troubleshooting:** See `GOOGLE_FORM_TROUBLESHOOTING.md`
- **Setup Guide:** See `WAITLIST_SETUP.md`

---

**Happy Testing! 🚀**

Start with the NutriNest Build Page and Waitlist Form - those are the most important!
