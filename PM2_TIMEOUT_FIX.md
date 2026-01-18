# PM2 Daemon Spawn Timeout Fix

## Problem
PM2 gets stuck at "Spawning PM2 daemon" and never completes, causing deployment timeout.

## Root Causes

1. **PM2 Lock Files**: Stale lock files prevent PM2 from starting
2. **PM2 Daemon Already Running**: Conflicting PM2 instances
3. **Permission Issues**: PM2 home directory permissions
4. **Path Issues**: `pm2_home=/*` suggests path truncation or environment variable issues
5. **Hanging Processes**: Previous PM2 processes not fully killed

## Solutions

### Solution 1: Use deploy-safe.sh (Recommended)

The `deploy-safe.sh` script includes:
- Multiple PM2 kill methods
- Lock file cleanup
- Explicit PM2_HOME setting
- Timeout protection on all PM2 commands
- Better error handling

```bash
# On your server
cd /var/www/react-app
bash deploy-safe.sh
```

### Solution 2: Manual PM2 Cleanup

If PM2 is stuck, run these commands on your server:

```bash
# 1. Kill all PM2 processes
pkill -9 -f pm2
pkill -9 -f "node.*pm2"

# 2. Clean PM2 lock files
rm -f ~/.pm2/.sock
rm -f ~/.pm2/lock
rm -f ~/.pm2/reload.lock
rm -f ~/.pm2/pids

# 3. Verify PM2 is stopped
pgrep -f pm2  # Should return nothing

# 4. Start fresh
pm2 start ecosystem.config.js
```

### Solution 3: Fix PM2_HOME Path

The `pm2_home=/*` suggests a path issue. Set it explicitly:

```bash
export PM2_HOME="$HOME/.pm2"
pm2 kill
pm2 start ecosystem.config.js
```

### Solution 4: Use PM2 Resurrect Instead

If PM2 keeps hanging, use a different approach:

```bash
# Stop PM2
pm2 kill

# Start without ecosystem (direct command)
pm2 start node_modules/next/dist/bin/next --name my-compasse-app -- start --port 9000

# Save
pm2 save
```

### Solution 5: Add Timeout to PM2 Commands

In your deployment script, wrap PM2 commands with timeout:

```bash
# Instead of: pm2 kill
timeout 5 pm2 kill || true

# Instead of: pm2 start
timeout 30 pm2 start ecosystem.config.js
```

### Solution 6: Check PM2 Status Before Starting

Add a check to ensure PM2 is fully stopped:

```bash
# Wait for PM2 to fully stop
while pgrep -f pm2 > /dev/null; do
  echo "Waiting for PM2 to stop..."
  sleep 1
  pkill -9 -f pm2 2>/dev/null || true
done
```

## Quick Fix Script

Create this on your server as `fix-pm2.sh`:

```bash
#!/bin/bash
echo "🔪 Force killing PM2..."
pkill -9 -f pm2
pkill -9 -f "node.*pm2"

echo "🧹 Cleaning PM2 files..."
rm -rf ~/.pm2/.sock
rm -rf ~/.pm2/lock
rm -rf ~/.pm2/reload.lock
rm -rf ~/.pm2/pids

echo "⏳ Waiting..."
sleep 3

echo "✅ PM2 should be fully stopped now"
pgrep -f pm2 || echo "Confirmed: No PM2 processes running"
```

## For Drone CI

Update your `.drone.yml` to use the safe deployment script:

```yaml
steps:
  - name: deploy
    commands:
      - cd /var/www/react-app
      - git pull origin main
      - bash deploy-safe.sh  # Use safe version
    timeout: 30m
```

Or add PM2 cleanup before deployment:

```yaml
steps:
  - name: cleanup-pm2
    commands:
      - pkill -9 -f pm2 || true
      - rm -f ~/.pm2/.sock ~/.pm2/lock ~/.pm2/reload.lock || true
    timeout: 2m

  - name: deploy
    commands:
      - cd /var/www/react-app
      - git pull origin main
      - bash deploy.sh
    timeout: 30m
```

## Debugging

If PM2 still hangs, check:

1. **PM2 Logs**:
   ```bash
   cat ~/.pm2/pm2.log
   ```

2. **PM2 Processes**:
   ```bash
   ps aux | grep pm2
   ```

3. **PM2 Home Directory**:
   ```bash
   echo $PM2_HOME
   ls -la ~/.pm2
   ```

4. **Port Status**:
   ```bash
   netstat -tlnp | grep 9000
   ```

5. **System Resources**:
   ```bash
   free -h
   df -h
   ```

## Prevention

Add to your deployment script:

```bash
# Always set PM2_HOME explicitly
export PM2_HOME="$HOME/.pm2"

# Always use timeout on PM2 commands
timeout 5 pm2 kill || true
timeout 30 pm2 start ecosystem.config.js

# Always verify PM2 stopped before starting
while pgrep -f pm2 > /dev/null; do
  pkill -9 -f pm2
  sleep 1
done
```

## Alternative: Use systemd Instead of PM2

If PM2 continues to cause issues, consider using systemd:

```bash
# Create systemd service
sudo nano /etc/systemd/system/compasse.service
```

```ini
[Unit]
Description=CompassE Next.js App
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/var/www/react-app
Environment=NODE_ENV=production
Environment=PORT=9000
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable compasse
sudo systemctl start compasse
```
