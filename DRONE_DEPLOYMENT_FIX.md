# Drone CI Deployment Timeout Fix

## Problem
The deployment is failing with "Run Command Timeout" error after PM2 cleanup.

## Solutions

### 1. Increase Timeout in Drone CI

In your `.drone.yml` file, increase the timeout for the deployment step:

```yaml
steps:
  - name: deploy
    commands:
      - cd /var/www/react-app
      - git pull origin main
      - bash deploy.sh
    timeout: 30m  # Increase from default (usually 5m or 10m)
```

### 2. Use the Provided deploy.sh Script

The `deploy.sh` script is optimized to:
- Handle errors gracefully
- Use `set -e` to exit on errors
- Add proper waits between steps
- Verify build success before proceeding

### 3. Break Down Deployment Steps

If the full deployment times out, break it into smaller steps:

```yaml
steps:
  - name: stop-pm2
    commands:
      - cd /var/www/react-app
      - pm2 delete my-compasse-app || true
      - pm2 kill || true
    timeout: 2m

  - name: pull-code
    commands:
      - cd /var/www/react-app
      - git pull origin main
    timeout: 5m

  - name: install-deps
    commands:
      - cd /var/www/react-app
      - npm ci --legacy-peer-deps
    timeout: 10m

  - name: build
    commands:
      - cd /var/www/react-app
      - npm run build
    timeout: 15m

  - name: start-pm2
    commands:
      - cd /var/www/react-app
      - pm2 start ecosystem.config.js
      - pm2 save
    timeout: 2m
```

### 4. Check Server Resources

The timeout might be caused by:
- **Low memory**: Build process runs out of memory
- **Slow disk I/O**: Build takes too long
- **Network issues**: npm install/downloads are slow

Check server resources:
```bash
# On your server
free -h
df -h
top
```

### 5. Optimize Build Process

Add these to your `package.json` scripts:
```json
{
  "scripts": {
    "build": "next build",
    "build:fast": "SKIP_ENV_VALIDATION=true next build"
  }
}
```

### 6. Use Build Cache

If using Docker or CI/CD with caching:
- Cache `node_modules`
- Cache `.next/cache`
- Only rebuild when dependencies change

### 7. Check Drone CI Logs

In Drone CI dashboard:
1. Check the full logs for the failing step
2. Look for specific error messages
3. Check if it's a network timeout or process timeout

### 8. Alternative: Deploy Manually First

Test the deployment script manually on the server:
```bash
ssh your-server
cd /var/www/react-app
bash deploy.sh
```

If it works manually, the issue is with Drone CI timeout settings.

### 9. Use Health Checks

Add a health check step to verify deployment:
```yaml
- name: health-check
  commands:
    - sleep 10
    - curl -f http://localhost:9000 || exit 1
  timeout: 1m
```

### 10. Monitor Deployment

Add logging to see where it's hanging:
```bash
#!/bin/bash
set -x  # Enable debug mode
# ... rest of deploy.sh
```

## Quick Fix

1. **Increase timeout** in `.drone.yml`:
   ```yaml
   timeout: 30m
   ```

2. **Use the provided `deploy.sh`** script

3. **Test manually** on server first

4. **Check Drone CI logs** for specific error

## Common Timeout Causes

| Cause | Solution |
|-------|----------|
| Build takes > 10 minutes | Increase timeout to 30m |
| npm install slow | Use `npm ci` or cache node_modules |
| PM2 commands hang | Add `|| true` to handle errors |
| Network issues | Check server connectivity |
| Low memory | Increase server RAM or add swap |

## Verification

After fixing, verify deployment:
```bash
# On server
pm2 list
pm2 logs my-compasse-app --lines 50
curl http://localhost:9000
```
