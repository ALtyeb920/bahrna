module.exports = {
  apps: [
    {
      name: "bahrna",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/bahrna",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/pm2/bahrna-error.log",
      out_file: "/var/log/pm2/bahrna-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
