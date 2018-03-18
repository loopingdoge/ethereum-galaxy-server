module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name: 'Eth 1h',
            script: './build/index.js',
            env: {
                NODE_ENV: 'development',
                ETH_HOURS: 1
            },
            env_production: {
                NODE_ENV: 'production',
                ETH_HOURS: 1
            }
        },

        {
            name: 'Eth 4h',
            script: './build/index.js',
            env: {
                NODE_ENV: 'development',
                ETH_HOURS: 4
            },
            env_production: {
                NODE_ENV: 'production',
                ETH_HOURS: 4
            }
        }
    ]
}
