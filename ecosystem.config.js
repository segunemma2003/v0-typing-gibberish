module.exports = {
  apps: [
    {
      name: 'my-compasse-app',
      // If using standalone output, use: script: './.next/standalone/server.js'
      // Otherwise use npm start
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/react-app',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 9000,
        HOSTNAME: '0.0.0.0',
      },
      // Explicitly set port to match Nginx configuration
      env_production: {
        NODE_ENV: 'production',
        PORT: 9000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Restart the app if it crashes
      min_uptime: '10s',
      max_restarts: 10,
      // Increase node memory if needed
      node_args: '--max-old-space-size=2048',
    },
  ],
}

