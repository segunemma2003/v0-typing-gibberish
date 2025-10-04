# 🚀 Deployment Checklist for demo.theqcare.org

## Current Status
✅ Code pushed to GitHub (commit: be5b303)  
⏳ Waiting for Netlify deployment  
❓ Need to verify Netlify & Cloudflare configuration

---

## ⚡ IMMEDIATE ACTIONS (Do in Order)

### 1️⃣ Verify Netlify Build (2 minutes)

**Check if deployment is complete:**

1. Go to: https://app.netlify.com/ (your Netlify dashboard)
2. Click on your site
3. Go to **Deploys** tab
4. Look for the latest deploy (should show commit: "Fix: Add subdomain detection...")
5. Status should be: **Published** (green checkmark)

**If build is failing:**
- Click on the failed deploy
- Check the **Deploy log** for errors
- Look for error messages and share them with me

---

### 2️⃣ Verify Netlify Domain Configuration (CRITICAL - 3 minutes)

Go to: **Netlify Dashboard → Your Site → Domain management**

**You MUST have these exact domains:**

```
Primary domain:
✅ theqcare.org

Domain aliases:
✅ *.theqcare.org    ← THIS IS CRITICAL!
```

**If `*.theqcare.org` is missing:**
1. Click **Add domain alias**
2. Enter exactly: `*.theqcare.org`
3. Click **Verify**
4. Wait 1-2 minutes

**Screenshot what you see and tell me if the wildcard is there!**

---

### 3️⃣ Verify Cloudflare DNS (CRITICAL - 5 minutes)

Go to: **Cloudflare Dashboard → theqcare.org → DNS → Records**

**You MUST have these TWO records:**

```
Record 1 (Main domain):
Type:    CNAME
Name:    @ (or "theqcare.org")
Target:  YOUR-SITE-NAME.netlify.app    ← Replace with your actual Netlify URL
Proxy:   🟧 Proxied (orange cloud ON)
TTL:     Auto

Record 2 (Wildcard - THIS IS CRITICAL):
Type:    CNAME
Name:    *    ← Asterisk (means all subdomains)
Target:  YOUR-SITE-NAME.netlify.app    ← Same as above
Proxy:   🟧 Proxied (orange cloud ON)
TTL:     Auto
```

**Find your Netlify site name:**
- Go to Netlify Dashboard → Site settings → General
- Look for "Site name" (e.g., `lustrous-malasada-aaed22.netlify.app`)

**If wildcard record is missing:**
1. Click **Add record**
2. Type: CNAME
3. Name: `*` (just the asterisk)
4. Target: `your-actual-site.netlify.app`
5. Enable proxy (orange cloud)
6. Save

---

### 4️⃣ Verify Cloudflare SSL (CRITICAL - 2 minutes)

Go to: **Cloudflare Dashboard → SSL/TLS**

**Main Settings:**
```
Encryption mode: Full    ← NOT "Flexible" or "Full (strict)"
```

Go to: **SSL/TLS → Edge Certificates**

**Verify these settings:**
```
✅ Always Use HTTPS: ON
❌ Automatic HTTPS Rewrites: OFF (turn this OFF!)
✅ Universal SSL: Active Certificate
```

**If Universal SSL is not active:**
- Wait 15 minutes (it provisions automatically)
- Refresh the page

---

### 5️⃣ Clear ALL Caches (1 minute)

**Netlify:**
1. Go to: Deploys tab
2. Click: **Trigger deploy** button
3. Select: **Clear cache and deploy site**

**Cloudflare:**
1. Go to: Caching → Configuration
2. Click: **Purge Everything**
3. Confirm

**Browser:**
- Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or use Incognito/Private mode

---

### 6️⃣ Test DNS Resolution (1 minute)

**Open Terminal and run:**

```bash
# Test if DNS is configured
nslookup demo.theqcare.org

# Should show Cloudflare IPs like:
# 104.x.x.x or 172.x.x.x
```

**If it shows "can't find demo.theqcare.org":**
- DNS wildcard record is missing or not propagated
- Go back to Step 3

---

### 7️⃣ Wait for Propagation (5-10 minutes)

After making DNS changes:
- Wait 5-10 minutes
- Grab a coffee ☕
- DNS propagation takes time

---

## 🔍 TESTING (After all steps above)

### Test URLs in this order:

1. **Main domain:**
   ```
   https://theqcare.org
   → Should show: School selection page
   ```

2. **Demo subdomain:**
   ```
   https://demo.theqcare.org
   → Should show: Demo Elementary School login page
   ```

3. **Test subdomain:**
   ```
   https://test.theqcare.org
   → Should show: Test High School login page
   ```

### Check Browser Console (F12)

After visiting `https://demo.theqcare.org`:
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for these logs:
   ```
   SchoolRouter: hostname = demo.theqcare.org
   SchoolRouter: detected subdomain = demo
   ```

---

## 🚨 Common Issues & Solutions

### Issue: "Page Not Found" / 404

**Possible causes:**

1. **Netlify wildcard domain missing:**
   - Go to Netlify Domain management
   - Add `*.theqcare.org` if missing

2. **Cloudflare wildcard DNS missing:**
   - Go to Cloudflare DNS
   - Add CNAME record: Name=`*`, Target=`your-site.netlify.app`

3. **Build not completed:**
   - Check Netlify Deploys tab
   - Wait for green "Published" status

4. **DNS not propagated:**
   - Wait 10 minutes after DNS changes
   - Clear all caches
   - Try incognito mode

### Issue: "SSL Certificate Error"

**Solution:**
- Cloudflare SSL mode must be "Full"
- Wait 15 minutes for Universal SSL to activate
- Check Cloudflare → SSL/TLS → Edge Certificates

### Issue: "Too Many Redirects"

**Solution:**
- Change Cloudflare SSL from "Flexible" to "Full"
- Clear Cloudflare cache
- Wait 2-3 minutes

---

## 📊 What Should Be Configured

After completing all steps, you should have:

### Netlify:
- ✅ Site deployed successfully (green checkmark)
- ✅ Domain: `theqcare.org`
- ✅ Domain alias: `*.theqcare.org` ← CRITICAL!
- ✅ Environment variable: `NEXT_PUBLIC_MAIN_DOMAIN = theqcare.org`

### Cloudflare:
- ✅ DNS Record: `@` → `your-site.netlify.app` (Proxied)
- ✅ DNS Record: `*` → `your-site.netlify.app` (Proxied) ← CRITICAL!
- ✅ SSL Mode: Full
- ✅ Always Use HTTPS: ON
- ✅ Universal SSL: Active

### Your Browser:
- ✅ All caches cleared
- ✅ Using incognito mode for testing

---

## 🆘 Still Not Working?

**Share these with me:**

1. Screenshot of Netlify Domain management page
2. Screenshot of Cloudflare DNS records
3. Result of: `nslookup demo.theqcare.org`
4. Screenshot of Netlify deploy status
5. Browser console errors from `https://demo.theqcare.org`

**Quick debug command:**
```bash
curl -I https://demo.theqcare.org
```

Copy and paste the output.

---

## ⏱️ Timeline

- Netlify deploy: 2-5 minutes
- DNS propagation: 5-10 minutes
- SSL certificate: 15 minutes (first time)
- **Total wait time: ~20 minutes after pushing code**

Don't panic if it doesn't work immediately! ⏰

