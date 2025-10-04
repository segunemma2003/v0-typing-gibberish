# Subdomain Setup Guide for Compasse on Netlify + Cloudflare

## 🎯 Goal
Make `demo.theqcare.org`, `test.theqcare.org`, etc. work instead of URL parameters.

## 📋 Prerequisites
- Domain: `theqcare.org` registered
- Cloudflare account with domain added
- Netlify account with site deployed

---

## Step 1: Configure Netlify Domain Settings

### 1.1 Add Primary Domain
1. Go to Netlify Dashboard → Your Site → **Domain management**
2. Click **Add a domain**
3. Enter: `theqcare.org`
4. Click **Verify** and follow instructions

### 1.2 Add Wildcard Domain
1. In same **Domain management** section
2. Click **Add a domain** again
3. Enter: `*.theqcare.org` (this is the wildcard)
4. Click **Verify**

**Result:** Netlify will now accept requests to any subdomain like `demo.theqcare.org`, `test.theqcare.org`, etc.

---

## Step 2: Configure Cloudflare DNS

### 2.1 Main Domain Record
1. Go to Cloudflare Dashboard
2. Select `theqcare.org` domain
3. Go to **DNS** → **Records**
4. Add/Edit CNAME record:

```
Type:    CNAME
Name:    @ (or theqcare.org)
Target:  your-site-name.netlify.app
Proxy:   🟧 Proxied (orange cloud ON)
TTL:     Auto
```

### 2.2 Wildcard Subdomain Record
Add a wildcard CNAME for all subdomains:

```
Type:    CNAME
Name:    * (asterisk - this means "all subdomains")
Target:  your-site-name.netlify.app
Proxy:   🟧 Proxied (orange cloud ON)
TTL:     Auto
```

**IMPORTANT:** The wildcard `*` will match ALL subdomains (demo, test, greenwood, riverside, etc.)

---

## Step 3: Configure Cloudflare SSL

### 3.1 SSL/TLS Settings
1. Go to **SSL/TLS** tab in Cloudflare
2. Set encryption mode to: **Full** (NOT "Flexible" or "Full (strict)")

### 3.2 Edge Certificates
1. Go to **SSL/TLS** → **Edge Certificates**
2. Ensure these are enabled:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites: **OFF** (can cause issues)
   - ✅ Universal SSL: **Active**

### 3.3 Wait for SSL Certificate
- Universal SSL covers `*.theqcare.org` (wildcard)
- Wait 5-15 minutes for certificate to provision
- Check status: Should say "Active Certificate"

---

## Step 4: Test Your Setup

### 4.1 Verify DNS Propagation
```bash
# Test main domain
nslookup theqcare.org

# Test subdomain
nslookup demo.theqcare.org

# Both should resolve to Cloudflare IPs (104.x.x.x or 172.x.x.x)
```

### 4.2 Test URLs
Try these in your browser:

```
https://theqcare.org
→ Should show school selection page

https://demo.theqcare.org  
→ Should show Demo Elementary School login

https://test.theqcare.org
→ Should show Test High School login

https://greenwood.theqcare.org
→ Should show Greenwood High School login

https://riverside.theqcare.org
→ Should show Riverside Academy login
```

### 4.3 Test Redirect
```
https://theqcare.org?school=demo
→ Should REDIRECT to https://demo.theqcare.org
```

---

## Step 5: Deploy Updated Code

### 5.1 Commit Changes
```bash
git add .
git commit -m "Enable subdomain routing for production"
git push origin main
```

### 5.2 Deploy to Netlify
```bash
# Option 1: Using Git (automatic)
# Just push to main branch, Netlify auto-deploys

# Option 2: Using Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 5.3 Clear Caches
1. **Netlify:** Deploys → Trigger deploy → "Clear cache and deploy site"
2. **Cloudflare:** Caching → Configuration → "Purge Everything"
3. **Browser:** Hard refresh (Cmd/Ctrl + Shift + R)

---

## 🔧 Troubleshooting

### Issue: "DNS_PROBE_FINISHED_NXDOMAIN"
**Cause:** DNS not configured or not propagated  
**Fix:** 
- Check Cloudflare DNS has wildcard `*` CNAME record
- Wait 5-10 minutes for DNS propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)

### Issue: "SSL Certificate Error"
**Cause:** Cloudflare Universal SSL not active yet  
**Fix:**
- Go to SSL/TLS → Edge Certificates
- Check "Universal SSL" status
- Wait 15 minutes for provisioning
- Ensure "Always Use HTTPS" is enabled

### Issue: "Page Not Found" on subdomain
**Cause:** Netlify doesn't recognize subdomain  
**Fix:**
- Verify `*.theqcare.org` is added in Netlify Domain settings
- Redeploy site
- Check Netlify build logs for errors

### Issue: Subdomain redirects to URL parameter
**Cause:** Middleware not detecting subdomain  
**Fix:**
- Check browser console for hostname detection logs
- Verify `X-Subdomain` header is set in Network tab
- Check middleware.ts is correctly deployed

### Issue: "Too many redirects" error
**Cause:** Cloudflare SSL in "Flexible" mode  
**Fix:**
- Change Cloudflare SSL to "Full" mode
- Clear Cloudflare cache
- Wait 2-3 minutes

---

## 📊 DNS Configuration Summary

After setup, your Cloudflare DNS should look like:

| Type  | Name              | Target                    | Proxy |
|-------|-------------------|---------------------------|-------|
| CNAME | @                 | your-site.netlify.app     | 🟧 ON |
| CNAME | *                 | your-site.netlify.app     | 🟧 ON |

And Netlify domains should show:

- ✅ `theqcare.org` (primary)
- ✅ `*.theqcare.org` (wildcard)

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] Netlify has `*.theqcare.org` added in Domain settings
- [ ] Cloudflare DNS has wildcard `*` CNAME record
- [ ] Cloudflare SSL set to "Full" mode
- [ ] Universal SSL shows "Active"
- [ ] Code deployed with updated middleware
- [ ] Netlify build succeeded (check logs)
- [ ] All caches cleared (Netlify + Cloudflare + Browser)
- [ ] Waited 5-10 minutes after DNS changes

---

## 🎓 How It Works

1. **User visits:** `demo.theqcare.org`
2. **Cloudflare DNS:** Routes to `your-site.netlify.app` (wildcard CNAME)
3. **Cloudflare SSL:** Encrypts with Universal SSL
4. **Netlify:** Accepts request (because `*.theqcare.org` configured)
5. **Next.js Middleware:** Extracts subdomain from hostname (`demo`)
6. **Tenant System:** Loads Demo Elementary School data
7. **Page Renders:** Shows demo school login page

---

## 📞 Still Not Working?

Share these details:
1. Your Netlify site name (e.g., `awesome-site-123456`)
2. Screenshot of Cloudflare DNS records
3. Screenshot of Netlify Domain settings
4. Browser console errors (F12)
5. Result of: `nslookup demo.theqcare.org`
