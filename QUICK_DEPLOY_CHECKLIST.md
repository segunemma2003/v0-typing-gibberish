# ⚡ QUICK DEPLOY CHECKLIST - Fix 404 Errors

## ✅ What Was Fixed
- Added `@netlify/plugin-nextjs` to package.json
- Updated netlify.toml with `publish = ".next"`
- Updated next.config.mjs with `output: undefined`

## 🚀 Deploy NOW (5 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Test build locally
npm run build

# 3. Commit changes
git add package.json netlify.toml next.config.mjs

# 4. Commit with message
git commit -m "Fix: Add Netlify plugin to resolve 404 errors"

# 5. Deploy to Netlify
git push origin main
```

## ⏱️ Wait 3-5 Minutes for Build

Go to Netlify dashboard and watch build progress.

## 🔥 Clear Caches (CRITICAL)

### Netlify
1. Deploys → Trigger deploy → Clear cache and deploy

### Cloudflare (if using)
1. Caching → Purge Everything
2. Wait 30 seconds

### Browser
- Use **Incognito/Private mode** (best option)
- Or press `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

## ✅ Test Your Site

```
✅ https://theqcare.org → School selection page
✅ https://demo.theqcare.org → Demo school login
✅ https://test.theqcare.org → Test school login
```

## 🎯 Success Indicators

In Netlify build logs, look for:
```
✅ @netlify/plugin-nextjs installed
✅ Next.js Plugin initialized
✅ Build succeeded
✅ Site is live
```

## 🐛 If Still 404

1. **Wait 2-3 more minutes** (cache/DNS propagation)
2. **Clear Cloudflare cache again**
3. **Try different browser/incognito**
4. **Check Netlify build logs for errors**
5. **Verify Cloudflare SSL = "Full"** (not "Flexible")

## 📝 Demo Credentials

- Admin: admin@school.edu / password123
- Teacher: teacher@school.edu / password123
- Student: student@school.edu / password123
- Parent: parent@school.edu / password123

---

**Total time: ~10 minutes from commit to working site** ⏱️

See `DEPLOY_NOW.md` for detailed instructions.
See `FIX_SUMMARY.md` for technical explanation.


