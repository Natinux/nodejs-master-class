/**
 * Config File
 */
const environments = {
    'staging': {
        'httpPort' : 3000,
        'httpsPort' : 4433,
        'envName' : 'staging'
    },
    'production': {
        'httpPort' : 5000,
        'httpsPort' : 443,
        'envName' : 'production'
    }
};

const env = process.env.NODE_ENV;
const currentEnvironment = typeof(env) == 'string' ? env.toLocaleLowerCase() : '';

// Export config object (default to staging)
module.exports = environments[currentEnvironment] || environments.staging;
