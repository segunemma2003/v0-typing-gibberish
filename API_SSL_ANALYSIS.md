# API SSL Analysis & Potential Issues

## Current Configuration

### API Base URL
- **Default:** `https://api.compasse.net` ✅ (HTTPS)
- **Environment Variable:** `NEXT_PUBLIC_API_BASE_URL`
- **Location:** Set in `lib/api/public.ts` and `lib/api/apiClient.ts`

### API Endpoint
- **Endpoint:** `GET /api/v1/schools/by-subdomain/{subdomain}`
- **Full URL:** `https://api.compasse.net/api/v1/schools/by-subdomain/{subdomain}`
- **Authentication:** ❌ None required (public endpoint)

---

## ✅ Good News - No SSL Issues Expected

### 1. HTTPS by Default
```typescript
// lib/api/public.ts
const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.compasse.net';
```
✅ **Uses HTTPS** - No mixed content issues

### 2. API Server Has SSL
From server analysis:
- ✅ `api.compasse.net` has SSL certificate configured
- ✅ Certificate location: `/etc/letsencrypt/live/api.compasse.net/`
- ✅ Nginx configured for HTTPS on port 443

### 3. Same-Origin Policy
- Frontend: `https://demo.theqcare.org` (HTTPS)
- API: `https://api.compasse.net` (HTTPS)
- ✅ **Both use HTTPS** - No mixed content warnings

---

## ⚠️ Potential Issues & Solutions

### Issue 1: API Server SSL Certificate Invalid/Expired

**Symptoms:**
- Browser console: `NET::ERR_CERT_AUTHORITY_INVALID`
- Network tab: SSL handshake failed
- API calls fail with certificate errors

**Check:**
```bash
# Test API SSL certificate
openssl s_client -connect api.compasse.net:443 -servername api.compasse.net

# Should show: "Verify return code: 0 (ok)"
```

**Fix:**
- Renew SSL certificate on API server
- Check certificate expiration: `certbot certificates`
- Renew if needed: `certbot renew`

---

### Issue 2: CORS Issues (Not SSL, but related)

**Symptoms:**
- Browser console: `CORS policy: No 'Access-Control-Allow-Origin'`
- API calls fail with CORS errors

**Check:**
- API server must allow requests from `https://theqcare.org` and `https://*.theqcare.org`
- API must send proper CORS headers

**Fix:**
- Configure CORS on API server to allow:
  - `https://theqcare.org`
  - `https://*.theqcare.org`
  - `https://compasse.net`
  - `https://*.compasse.net`

---

### Issue 3: Environment Variable Not Set (Uses HTTP)

**Symptoms:**
- API calls go to HTTP instead of HTTPS
- Mixed content warnings in browser
- API calls blocked by browser

**Check:**
```bash
# On Netlify
# Go to: Site settings → Environment variables
# Verify: NEXT_PUBLIC_API_BASE_URL = https://api.compasse.net
```

**Fix:**
- Set `NEXT_PUBLIC_API_BASE_URL=https://api.compasse.net` in Netlify
- Ensure it starts with `https://` (not `http://`)

---

### Issue 4: API Server Behind Proxy (SSL Termination)

**Symptoms:**
- SSL works but API returns errors
- Certificate valid but connection issues

**Check:**
- If API is behind Cloudflare or another proxy
- Ensure SSL mode is "Full" (not "Flexible")

**Fix:**
- Cloudflare SSL mode: "Full"
- Ensure API server accepts HTTPS connections

---

## 🔍 Testing SSL Configuration

### Test 1: Check API SSL Certificate
```bash
curl -I https://api.compasse.net/api/v1/schools/by-subdomain/excellence-academy

# Should return HTTP 200 or 404 (not SSL errors)
```

### Test 2: Check Certificate Validity
```bash
openssl s_client -connect api.compasse.net:443 -servername api.compasse.net 2>/dev/null | \
  openssl x509 -noout -dates

# Should show valid dates (not expired)
```

### Test 3: Test from Browser Console
```javascript
// Open browser console on https://demo.theqcare.org
fetch('https://api.compasse.net/api/v1/schools/by-subdomain/excellence-academy')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Should not show SSL errors
```

---

## ✅ Recommended Configuration

### Netlify Environment Variables
```
NEXT_PUBLIC_API_BASE_URL=https://api.compasse.net
NEXT_PUBLIC_MAIN_DOMAIN=theqcare.org
```

### API Server (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name api.compasse.net;
    
    ssl_certificate /etc/letsencrypt/live/api.compasse.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.compasse.net/privkey.pem;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' 'https://theqcare.org' always;
    add_header 'Access-Control-Allow-Origin' 'https://*.theqcare.org' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    
    # ... rest of config
}
```

---

## 🚨 If You Experience SSL Issues

### Quick Diagnostic Steps:

1. **Check API SSL Certificate:**
   ```bash
   curl -v https://api.compasse.net/api/v1/health
   # Look for SSL errors in output
   ```

2. **Check Browser Console:**
   - Open `https://demo.theqcare.org`
   - Press F12 → Console tab
   - Look for SSL/certificate errors

3. **Check Network Tab:**
   - F12 → Network tab
   - Try to load subdomain
   - Check if API call fails
   - Look at response headers

4. **Verify Environment Variable:**
   - Netlify Dashboard → Site settings → Environment variables
   - Ensure `NEXT_PUBLIC_API_BASE_URL` is set to `https://api.compasse.net`

---

## 📋 Checklist

- [ ] API server has valid SSL certificate (`api.compasse.net`)
- [ ] Certificate is not expired
- [ ] `NEXT_PUBLIC_API_BASE_URL` is set to `https://api.compasse.net` (not `http://`)
- [ ] API server allows CORS from `theqcare.org` subdomains
- [ ] API endpoint `/api/v1/schools/by-subdomain/{subdomain}` is accessible
- [ ] No mixed content warnings in browser console
- [ ] API calls work from browser console

---

## ✅ Conclusion

**You should NOT have SSL issues** because:

1. ✅ API uses HTTPS by default (`https://api.compasse.net`)
2. ✅ API server has SSL certificate configured
3. ✅ Frontend uses HTTPS (via Netlify/Cloudflare)
4. ✅ No mixed content (both HTTPS)

**However, watch out for:**
- ⚠️ Expired SSL certificates on API server
- ⚠️ CORS configuration issues
- ⚠️ Environment variable not set correctly

**If issues occur:**
1. Check API server SSL certificate
2. Verify environment variables
3. Check browser console for errors
4. Test API endpoint directly with curl

---

## 🔗 Related Files

- `lib/api/public.ts` - Public API client (no auth)
- `lib/api/apiClient.ts` - Authenticated API client
- `SSL_SUBDOMAIN_FIX.md` - Frontend SSL issues
- `SERVER_SSL_ANALYSIS.md` - Server SSL configuration

