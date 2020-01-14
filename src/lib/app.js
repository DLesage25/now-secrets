const now = require('./now');
const manifold = require('./manifold');

module.exports = {
    ImportFromManifoldIntoEnvFile: async () => {
        try {
            await manifold.login();
            await manifold.switchToProdEnv();
            await manifold.writeEnvsToFileFromManifold();
            return true;
        } catch (err) {
            return err;
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
