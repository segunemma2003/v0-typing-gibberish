# Deployment Troubleshooting Guide

## 502 Gateway Error - Common Causes & Solutions

### 1. Check PM2 Status
```bash
pm2 list
pm2 logs my-compasse-app --lines 100
```

### 2. Check if Node.js Process is Running
```bash
ps aux | grep node
netstat -tlnp | grep :3000
```

### 3. Verify Build Output
```bash
ls -la .next
ls -la .next/standalone (if using standalone output)
```

### 4. Check Nginx Configuration
```bash
sudo nginx -t
sudo cat /etc/nginx/sites-available/default
# or
sudo cat /etc/nginx/sites-available/your-site-config
```

### 5. Check Environment Variables
```bash
# In your project directory
cat .env.local
# Or check PM2 environment
pm2 env my-compasse-app
```

### 6. Check Port Binding
The app should run on port 3000 by default. Make sure:
- PM2 is configured correctly
- Nginx proxy_pass points to the correct port (usually 127.0.0.1:3000)
- No firewall blocking the port

### 7. Restart Services
```bash
# Restart PM2
pm2 restart my-compasse-app
pm2 save

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

### 8. Check Disk Space
```bash
df -h
```

### 9. Check Memory Usage
```bash
free -h
pm2 monit
```

### 10. View Real-time Logs
```bash
pm2 logs my-compasse-app --lines 0
# Or check system logs
sudo journalctl -u nginx -f
```

## Common Fixes

### Fix 1: PM2 Not Running
```bash
cd /var/www/react-app
pm2 start ecosystem.config.js
# Or
pm2 start npm --name "my-compasse-app" -- start
pm2 save
```

### Fix 2: Build Issues
```bash
cd /var/www/react-app
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build
pm2 restart my-compasse-app
```

### Fix 3: Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
# Restart PM2
pm2 restart my-compasse-app
```

### Fix 4: Missing Environment Variables
Create or update `.env.local` with:
```
NODE_ENV=production
NEXT_PUBLIC_BASE_DOMAIN=your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
```

Then restart PM2:
```bash
pm2 restart my-compasse-app
```

### Fix 5: Nginx Configuration
Ensure your Nginx config has:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Then reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Quick Diagnostic Script
Run this on your VPS:
```bash
cd /var/www/react-app
echo "=== PM2 Status ==="
pm2 list
echo ""
echo "=== PM2 Logs (last 50 lines) ==="
pm2 logs my-compasse-app --lines 50 --nostream
echo ""
echo "=== Port Check ==="
netstat -tlnp | grep :3000
echo ""
echo "=== Nginx Status ==="
sudo systemctl status nginx | head -20
echo ""
echo "=== Node Version ==="
node -v
npm -v
echo ""
echo "=== Build Check ==="
ls -la .next 2>/dev/null || echo ".next directory not found"
```

