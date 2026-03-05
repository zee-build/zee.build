# Vercel Environment Variables Setup

**Required for:** Waitlist form to work on production

## Environment Variables Needed

Add these 4 variables in Vercel Dashboard:

### 1. GOOGLE_FORM_ID
```
Value: 1FAIpQLScUjv6OEUXEHW7ADAxSRtqmEpPJ46wvCP-gJ7mxEKsmV8aM5Q
Environments: Production, Preview, Development
```

### 2. GOOGLE_FORM_EMAIL_ENTRY
```
Value: 1974560826
Environments: Production, Preview, Development
```

### 3. GOOGLE_FORM_AGE_ENTRY
```
Value: 2130672761
Environments: Production, Preview, Development
```

### 4. GOOGLE_FORM_LOCATION_ENTRY
```
Value: 352004114
Environments: Production, Preview, Development
```

## How to Add

1. Go to: https://vercel.com/zee-build/zee-build/settings/environment-variables
2. Click "Add New" for each variable
3. Enter Key and Value
4. Select all 3 environments (Production, Preview, Development)
5. Click Save
6. After adding all 4, trigger a redeploy

## Verification

After redeployment, check Function logs:
- Go to Deployments → Latest → Functions → /api/waitlist
- Should see all environment variables as `true`
- Form submissions should return 200 status

## Troubleshooting

If form still shows "Server configuration error":
1. Verify all 4 variables are added
2. Verify variable names match exactly (case-sensitive)
3. Verify all 3 environments are selected
4. Trigger a manual redeploy
5. Clear browser cache and test again
