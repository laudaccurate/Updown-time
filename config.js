// Create and export environment configurations

var environments = {};

// Staging environment {Default}
environments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: 'staging',
};

// Production environment
environments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: 'production',
};

// Determine environment passed in the command line args
var currentEnvironment =
	typeof process.env.NODE_ENV == 'string'
		? process.env.NODE_ENV.toLowerCase()
		: '';

// Check if that environment is defined above. If not, default to staging
var exportedEnvConfig =
	typeof environments[currentEnvironment] == 'object'
		? environments[currentEnvironment]
		: environments.staging;

module.exports = exportedEnvConfig;
