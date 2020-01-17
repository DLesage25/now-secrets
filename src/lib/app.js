const now = require('./now');
const manifold = require('./manifold');

const { errorLog, successLog } = require('./utils');

module.exports = {
    ImportFromManifoldIntoEnvFile: async () => {
        try {
            await manifold.login();
            await manifold.switchToProdEnv();
            await manifold.writeEnvsToFileFromManifold();
            return true;
        } catch (err) {
            errorLog(err);
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
