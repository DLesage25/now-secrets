const CLI = require('clui');
const Conf = require('conf');

const config = new Conf();
const chalk = require('chalk');

const { spawn } = require('child_process');

// const Spinner = CLI.Spinner;

const form = require('./form');

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

const getAllNowTokens = async () => {
    return true;
};

const checkForAuthentication = async () => {
    const token = await checkForNowToken();
    return new Promise(resolve => {
        spawn('now', ['ls', '-t', token]).on('exit', code =>
            resolve(code === 0)
        );
    });
};

const checkForNowToken = async () => {
    const token = config.get('now.token');

    if (!token) {
        let { nowToken } = await form.askForNowToken();
        setNowToken(nowToken);
        return nowToken;
    } else return token;
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
    checkForAuthentication,
    getAllNowTokens
};
