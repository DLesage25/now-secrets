const { spawn } = require('child_process');
const now = require('./now');

module.exports = {
    CheckIfLoggedIn: () => {
        return new Promise((resolve, reject) => {});
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
