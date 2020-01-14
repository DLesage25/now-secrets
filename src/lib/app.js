const now = require('./now');
const manifold = require('./manifold');
const { successLog, errorLog } = require('./utils');

module.exports = {
    ImportFromManifoldIntoEnvFile: async () => {
        try {
            await manifold.login();
            await manifold.switchToProdEnv();
            await manifold.writeEnvsToFileFromManifold();
            successLog('Imported envs from Manifold successfully');
            return true;
        } catch (err) {
            return errorLog(err);
        }
    },
    UpdateManifoldFromEnvFile: async () => {
        try {
            await manifold.login();
            await manifold.switchToProdEnv();
            await manifold.writeEnvsToManifoldFromFile();
            successLog('Updated Manifold envs from local file');
            return true;
        } catch (err) {
            return errorLog(err);
        }
    },
    ImportFromNowIntoEnvFile: async () => {
        const isLogged = await now.checkForAuthentication();

        if (!isLogged) {
            console.log('Please log in to Now and try again.');
            process.exit(0);
        }

        console.log('worked ' + isLogged);
    }
};
