# ⚡ Quick Fix for Netlify Deployment

## 🚨 Error: `pnpm: command not found`
**FIXED** ✅ Changed build command to use `npm` instead

## 🎯 Enable Real Subdomains (demo.theqcare.org)

### Required Steps (Do in Order):

### 1️⃣ Configure Cloudflare DNS (5 minutes)
```
Go to Cloudflare → DNS → Records → Add:

Record 1:
Type: CNAME
Name: @
Target: your-site-name.netlify.app  
Proxy: ON (orange cloud)

Record 2:
Type: CNAME  
Name: *
Target: your-site-name.netlify.app
Proxy: ON (orange cloud)
```

### 2️⃣ Configure Cloudflare SSL (2 minutes)
```
Go to Cloudflare → SSL/TLS
Set to: FULL (not Flexible)

Go to SSL/TLS → Edge Certificates
Enable: Always Use HTTPS
Disable: Automatic HTTPS Rewrites
```

### 3️⃣ Configure Netlify Domains (3 minutes)
```
Go to Netlify → Domain management
Add domains:
1. theqcare.org
2. *.theqcare.org (wildcard)
```

### 4️⃣ Deploy Code (2 minutes)
```bash
git add .
git commit -m "Enable subdomain routing"
git push origin main

# Wait for Netlify auto-deploy OR:
npm install -g netlify-cli
netlify deploy --prod
```

### 5️⃣ Clear All Caches (1 minute)
```
1. Netlify: Trigger deploy → "Clear cache and deploy"
2. Cloudflare: Caching → "Purge Everything"  
3. Browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### 6️⃣ Wait & Test (5-10 minutes)
```
Wait for DNS propagation (5-10 min)

Then test:
https://theqcare.org → School selection
https://demo.theqcare.org → Demo school login ✅
https://test.theqcare.org → Test school login ✅

Old URL parameter approach will redirect:
https://theqcare.org?school=demo → Redirects to demo.theqcare.org
```

---

## 🔍 Verify Setup

### Check DNS:
```bash
nslookup demo.theqcare.org
# Should show Cloudflare IPs
```

### Check Netlify Build:
```bash
netlify deploy --prod
# Should show:
# ✅ Using Next.js Runtime
# ✅ Build succeeded
# ✅ Functions deployed
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| SSL Certificate Error | Wait 15 min for Cloudflare Universal SSL |
| DNS not resolving | Check wildcard `*` CNAME in Cloudflare DNS |
| Page Not Found | Add `*.theqcare.org` in Netlify domains |
| Too many redirects | Change Cloudflare SSL to "Full" mode |
| Build failing | Use `npm` not `pnpm` (already fixed) |

---

## 📚 Full Guides

- **Detailed subdomain setup:** See `SUBDOMAIN_SETUP_GUIDE.md`
- **Deployment troubleshooting:** See `NETLIFY_DEPLOYMENT_GUIDE.md`

---

## ✅ What Was Changed

1. ✅ `netlify.toml` - Changed `pnpm` to `npm`
2. ✅ `middleware.ts` - Added redirect from URL params to subdomains
3. ✅ `lib/dynamic-schools.ts` - Updated to use real subdomains in production
4. ✅ `components/school-router.tsx` - Shows subdomain links on production
5. ✅ `public/_redirects` - Created for Netlify routing

**Next:** Commit and push these changes!

