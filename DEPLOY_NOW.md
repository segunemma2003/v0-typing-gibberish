# 🚀 CRITICAL FIX: Deploy Instructions for 404 Errors

## ✅ What I Fixed

1. **Added `@netlify/plugin-nextjs`** to `package.json` - This plugin is **ESSENTIAL** for Next.js to work on Netlify
2. **Updated `netlify.toml`** - Added `publish = ".next"` to tell Netlify where the build output is
3. **Updated `next.config.mjs`** - Set `output: undefined` for Netlify compatibility

## 🔥 Deploy NOW - Step by Step

### Step 1: Install Dependencies Locally (Optional Test)

```bash
npm install
```

This will install the `@netlify/plugin-nextjs` package locally.

### Step 2: Test Build Locally (Optional but Recommended)

```bash
rm -rf .next
npm run build
```

If this succeeds, you're good to deploy! ✅

### Step 3: Commit and Push to Netlify

```bash
git add package.json netlify.toml next.config.mjs
git commit -m "Fix: Add Netlify plugin to fix 404 errors"
git push origin main
```

### Step 4: Monitor Netlify Build

1. Go to your Netlify dashboard
2. Watch the build logs
3. Look for these success indicators:

```
✅ Installing dependencies
✅ @netlify/plugin-nextjs installed
✅ Running build command
✅ Next.js Plugin initialized  
✅ Build succeeded
✅ Functions deployed
✅ Site is live
```

**Expected build time:** 3-5 minutes

### Step 5: Clear ALL Caches (CRITICAL!)

#### A. Clear Netlify Cache
1. Netlify Dashboard → Deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"

#### B. Clear Cloudflare Cache (if using Cloudflare)
1. Cloudflare Dashboard → theqcare.org
2. Caching → Configuration
3. Click "Purge Everything"
4. Wait 30 seconds

#### C. Clear Browser Cache
- **Best:** Use Incognito/Private browsing mode
- **Or:** Hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

### Step 6: Test Your Site

Test these URLs in order:

```
✅ https://theqcare.org
   Expected: School selection page

✅ https://demo.theqcare.org
   Expected: Demo Elementary School login page

✅ https://test.theqcare.org
   Expected: Test High School login page

✅ https://greenwood.theqcare.org
   Expected: Greenwood High School login page

✅ https://riverside.theqcare.org
   Expected: Riverside Academy login page
```

## 🔍 What to Check in Build Logs

If the build fails, look for:

- ❌ `Error: Cannot find module '@netlify/plugin-nextjs'` 
  - **This should NOT happen anymore** - we added it to package.json

- ❌ `Build failed: command not found`
  - Check that `npm run build` works locally first

- ❌ `404 on deployment`
  - Clear Netlify cache and redeploy
  - Clear Cloudflare cache
  - Try incognito mode

## ⚙️ Netlify Configuration Checklist

Make sure these are configured in Netlify:

### Domain Settings
1. Go to Netlify → Domain management
2. Add custom domain: `theqcare.org`
3. Add wildcard domain alias: `*.theqcare.org`
4. SSL should be auto-provisioned

### DNS Settings (in Cloudflare)
1. **A record** for `theqcare.org` → Netlify IP (or use CNAME)
2. **CNAME** for `*` (wildcard) → `your-site.netlify.app`
3. **Proxy status:** Can be proxied (orange cloud) or DNS only (grey cloud)

### SSL/TLS Settings (in Cloudflare)
- Set SSL/TLS encryption mode to **"Full"** (NOT "Flexible" or "Full (strict)")
- This prevents redirect loops

## 🐛 Troubleshooting

### Issue: Still getting 404 after deploy
**Solutions:**
1. Wait 2-3 minutes for cache/DNS propagation
2. Clear Cloudflare cache again
3. Try incognito mode
4. Check Netlify build logs for errors
5. Verify DNS is pointing correctly: `nslookup theqcare.org`

### Issue: Build succeeds but site shows blank page
**Solutions:**
1. Check browser console (F12) for JavaScript errors
2. Verify middleware.ts is not causing infinite redirects
3. Check that all environment variables are set in Netlify

### Issue: Main domain works but subdomains don't
**Solutions:**
1. Verify wildcard domain `*.theqcare.org` is added in Netlify
2. Check Cloudflare DNS has wildcard CNAME record
3. Verify SSL certificate covers wildcard subdomains
4. Clear Cloudflare cache

### Issue: "Too many redirects" error
**Solutions:**
1. Cloudflare SSL/TLS → Set to "Full" (not "Flexible")
2. Check middleware.ts for redirect loops
3. Temporarily disable Cloudflare proxy (grey cloud)

### Issue: Subdomains redirect to URL parameter (e.g., ?school=demo)
**This is expected behavior for `.netlify.app` subdomains**
- Netlify doesn't support SSL for custom subdomains on `.netlify.app`
- Only `theqcare.org` subdomains should work properly
- Make sure you're testing on `demo.theqcare.org` not `demo.your-site.netlify.app`

## ⏱️ Expected Timeline

1. **Commit & Push:** 1 minute
2. **Netlify Build:** 3-5 minutes
3. **Cache Clear:** 1 minute
4. **DNS/Cache Propagation:** 2-5 minutes
5. **Total Time:** ~10-15 minutes

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Netlify build completes without errors
- ✅ `https://theqcare.org` shows school selection page
- ✅ `https://demo.theqcare.org` shows Demo Elementary School login
- ✅ `https://test.theqcare.org` shows Test High School login
- ✅ No 404 errors on any page
- ✅ Middleware correctly detects subdomains
- ✅ Browser console shows no errors

## 📝 Demo Credentials

After deployment, test login with:

- **Admin:** admin@school.edu / password123
- **Teacher:** teacher@school.edu / password123
- **Student:** student@school.edu / password123
- **Parent:** parent@school.edu / password123

## 🆘 Still Not Working?

If you still see 404 errors after following ALL steps above:

1. Share your Netlify build log (full text)
2. Run `nslookup theqcare.org` and share output
3. Check browser console (F12) and share any errors
4. Verify Cloudflare SSL is set to "Full"
5. Try accessing from a different network/device

---

## 🚀 Ready? Run these commands:

```bash
# Install dependencies locally (to test)
npm install

# Test build locally
npm run build

# If successful, commit and deploy
git add package.json netlify.toml next.config.mjs
git commit -m "Fix: Add Netlify plugin to fix 404 errors"
git push origin main
```

**Then go to Netlify dashboard and watch the magic happen!** ✨

After build completes, **clear Netlify cache**, **clear Cloudflare cache**, then test in **incognito mode**.


