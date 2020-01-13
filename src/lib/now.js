const CLI = require('clui');
const Conf = require('conf');

const config = new Conf();
const chalk = require('chalk');

// const Spinner = CLI.Spinner;

const form = require('./form');
// const pkg = require('../package.json');

// const status = new Spinner('Authenticating you, please wait...');

// const authSpinner = {
//     start: () => {
//         status.start();
//         process.stdout.write('\n');
//     },
//     stop: () => {
//         status.stop();
//         process.stdout.write('\n');
//     }
// };

const authenticationFlow = async () => {
    const tokenPresent = checkForNowToken();

    if (tokenPresent) return true;
    else {
        let { nowToken } = await form.askForNowToken();
        setNowToken(nowToken);
    }
};

const checkForNowToken = () => {
    return !!config.get('now.token');
};

const getNowToken = () => {
    return config.get('now.token');
};

const removeAccessToken = async () => {
    config.set('now.token', '');
    console.log('Access token removed');
};

const setNowToken = async token => {
    config.set('now.token', token);
    return token;
};

const getAccessToken = async () => {
    let accessToken = config.get('now.token');
    // if (!accessToken) accessToken = await registerNewToken();
    return accessToken;
};

module.exports = {
    getNowToken,
    getAccessToken,
    removeAccessToken,
    setNowToken,
    authenticationFlow
};
