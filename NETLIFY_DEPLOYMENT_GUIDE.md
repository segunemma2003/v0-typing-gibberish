# Netlify Deployment Guide for Compasse

## 🚨 Common "Page Not Found" Fixes

### 1. **Cloudflare SSL Settings** (CRITICAL)
If you're using Cloudflare in front of Netlify:

1. Go to Cloudflare Dashboard → SSL/TLS
2. Set SSL/TLS encryption mode to: **"Full"** (NOT "Full (strict)")
3. Go to SSL/TLS → Edge Certificates
4. Enable "Always Use HTTPS"
5. Disable "Automatic HTTPS Rewrites" (can cause conflicts)

### 2. **Netlify Site Settings**

#### In Netlify Dashboard:
1. **Build & Deploy → Build settings:**
   - Build command: `pnpm install && pnpm run build`
   - Publish directory: `.next`
   - Node version: `20`

2. **Build & Deploy → Post processing:**
   - Disable "Pretty URLs" (Next.js handles this)
   - Disable "Asset optimization" (Next.js handles this)

3. **Domain Management:**
   - Primary domain: `theqcare.org`
   - Add wildcard subdomain: `*.theqcare.org`
   
4. **Environment Variables:**
   - Add: `NEXT_PUBLIC_MAIN_DOMAIN = theqcare.org`
   - Add: `NODE_VERSION = 20`

### 3. **Cloudflare DNS Settings**

For your main domain `theqcare.org`:

```
Type: CNAME
Name: @
Target: your-site-name.netlify.app
Proxy: ON (orange cloud)

Type: CNAME  
Name: *
Target: your-site-name.netlify.app
Proxy: ON (orange cloud)
```

**IMPORTANT:** Wait 5-10 minutes after DNS changes for propagation.

### 4. **Install Netlify Plugin**

The `@netlify/plugin-nextjs` should be automatically detected, but if issues persist:

```bash
# Install it as a dev dependency
pnpm add -D @netlify/plugin-nextjs
```

### 5. **Test Deployment Locally**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and test locally
pnpm run build

# Test with Netlify dev (simulates Netlify environment)
netlify dev

# Deploy to Netlify
netlify deploy --prod
```

### 6. **Check Build Logs**

In Netlify Dashboard:
1. Go to **Deploys** tab
2. Click on the latest deploy
3. Check **Deploy log** for errors
4. Look for:
   - ✅ "Next.js Plugin" initialized
   - ✅ Build succeeded
   - ✅ Functions deployed
   - ❌ Any error messages

### 7. **Common Issues & Solutions**

#### Issue: "Page Not Found" on homepage
**Solution:** Check that `app/page.tsx` exists and exports a default component

#### Issue: "Function not found"
**Solution:** Rebuild with `pnpm install && pnpm run build` to regenerate functions

#### Issue: "Mixed Content" errors with Cloudflare
**Solution:** Set Cloudflare SSL to "Full" mode, not "Flexible"

#### Issue: Subdomains not working
**Solution:** 
- Ensure wildcard DNS record exists in Cloudflare
- Check Netlify has wildcard domain configured
- Clear Cloudflare cache

### 8. **Clear All Caches**

After making changes:

1. **Netlify:** Deploys → Trigger Deploy → Clear cache and deploy site
2. **Cloudflare:** Caching → Configuration → Purge Everything
3. **Browser:** Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### 9. **Verify Deployment**

After deployment, test these URLs:

```
https://theqcare.org (should show school selection)
https://demo.theqcare.org (should redirect to ?school=demo)
https://theqcare.org?school=demo (should show Demo school login)
```

### 10. **Debug Checklist**

- [ ] `pnpm install && pnpm run build` works locally
- [ ] Netlify build logs show no errors
- [ ] @netlify/plugin-nextjs is initialized in logs
- [ ] Cloudflare SSL set to "Full" mode
- [ ] DNS records propagated (check with `nslookup theqcare.org`)
- [ ] Cloudflare cache cleared
- [ ] Browser cache cleared
- [ ] Netlify cache cleared and redeployed

## 🔧 Quick Fix Commands

```bash
# 1. Clean everything
rm -rf .next node_modules pnpm-lock.yaml

# 2. Fresh install
pnpm install

# 3. Test build
pnpm run build

# 4. If successful, commit and push
git add .
git commit -m "Fix Netlify deployment configuration"
git push

# 5. In Netlify: Trigger "Clear cache and deploy site"
```

## 📞 Still Having Issues?

Check these files are present:
- ✅ `netlify.toml` (configured)
- ✅ `public/_redirects` (created)
- ✅ `next.config.mjs` (configured)
- ✅ `app/page.tsx` (exists)
- ✅ `app/layout.tsx` (exists)

If still not working, share:
1. Netlify build log (full text)
2. Cloudflare SSL settings screenshot
3. Error message in browser console (F12)

