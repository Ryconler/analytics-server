module.exports = {
  apps : [{
    name: 'analytics-server',
    script: 'bin/www',
    watch: true,
    ignore_watch: ['node_modules'],
    env: {
      NODE_ENV: 'production'
    },
  }],
};
