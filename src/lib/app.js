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
    UpdateNowFromEnvFile: async () => {
        try {
            await now.checkForAuthentication();
            await now.getTokensAndUpdateNow();
            successLog('Now secrets updated succesfully!');
        } catch (e) {
            errorLog(`Error when updating Now from Env file: ${e}`);
        }
    }
};
