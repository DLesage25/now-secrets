const CLI = require('clui');
const Conf = require('conf');

const config = new Conf();

const { warningLog, parseFromEnvFile } = require('./utils');
const { getFileList, readFile } = require('./files');

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

const removeNowToken = nowToken => async name => {
    return new Promise((resolve, reject) => {
        const process = spawn('now', [
            '-t',
            nowToken,
            'secrets',
            'rm',
            name.toLowerCase(),
            '-y'
        ]);

        process.stdout.on('data', () => {
            resolve();
        });

        process.stderr.on('data', data => {
            reject(data);
        });
    });
};

/**
 * Checks if the user is authenticated with now, by running
 * a simple command that requires auth and checking if
 * the exit code is 0
 */
const checkForAuthentication = async () => {
    const token = await checkForNowToken();
    return new Promise((resolve, reject) => {
        spawn('now', ['ls', '-t', token]).on('exit', code => {
            if (code !== 0) {
                reject(
                    new Error(
                        'Could not authenticate with Now. Please log in and try again'
                    )
                );
            }
            resolve();
        });
    });
};

/**
 * Updates multiple tokens on Now. If one of them exists already, returns
 * an {alreadyExists} error
 * @param {Array} tokens
 */
const updateMultipleNowTokens = async tokens => {
    const nowToken = await getNowToken();
    let tokensToOverWrite = [];
    const results = await Promise.all(
        tokens.map(async token => {
            try {
                return await updateNowSecret(nowToken)(token);
            } catch (e) {
                if (e.alreadyExists) tokensToOverWrite.push(token);
                return e;
            }
        })
    );

    if (tokensToOverWrite.length) {
        const { response } = await form.askToSelectCheckboxes(
            "The following env variable(s) already exist. Select the ones you'd like to overwrite:",
            tokensToOverWrite.map(i => i.key.toLowerCase())
        );

        if (!response.length) return true;

        //delete all tokens from Now
        await Promise.all(
            response.map(async name => {
                try {
                    return await removeNowToken(nowToken)(name);
                } catch (e) {
                    warningLog(e);
                }
            })
        );

        tokensToOverWrite = tokensToOverWrite.filter(
            token => response.indexOf(token.key.toLowerCase()) !== -1
        );

        // once deleted, creazte all tokens again
        await Promise.all(
            tokensToOverWrite.map(async token => {
                try {
                    return await updateNowSecret(nowToken)(token);
                } catch (e) {
                    return e;
                }
            })
        );
    }
    return true;
};

/**
 * Update single now secret. Returns true if sucessful,
 * error message otherwise
 * @param {string} name
 * @param {string} value
 */
const updateNowSecret = nowToken => async ({ key, value }) => {
    return new Promise((resolve, reject) => {
        const process = spawn('now', [
            '-t',
            nowToken,
            'secrets',
            'add',
            key,
            value
        ]);
        //secret write was successful
        process.stdout.on('data', () => {
            resolve(true);
        });
        //error
        process.stderr.on('data', error => {
            error = error.toString('utf8');

            if (error.includes('already exists')) {
                reject({ alreadyExists: true });
            } else reject(new Error(error));
        });
    });
};

/**
 * Checks if a Now token is present in the package config
 * If not, asks for one
 * @returns now token
 */
const checkForNowToken = async () => {
    const token = config.get('now.token');

    if (!token) {
        let { nowToken } = await form.askForNowToken();
        setNowToken(nowToken);
        return nowToken;
    } else return token;
};

/**
 * Gets the now package token
 */
const getNowToken = () => {
    return config.get('now.token');
};

/**
 * Resets the now token in the package config
 */
const removeAccessToken = async () => {
    config.set('now.token', '');
    warningLog('Access token removed');
};

/**
 * Sets a new now token in the package config
 * @param {String} token
 */
const setNowToken = async token => {
    config.set('now.token', token);
    return token;
};

/**
 * Gets the now token in the package config
 */
const getAccessToken = async () => {
    let accessToken = config.get('now.token');
    // if (!accessToken) accessToken = await registerNewToken();
    return accessToken;
};

/**
 * Reads tokens from an env file in the current directory.
 * Asks user to select the env file to read from
 */
const getTokensFromEnv = async () => {
    const fileList = await getFileList('./');
    const { response } = await form.askToSelectFromList(
        'Please select the env file you want to use:',
        fileList
    );

    const envFileData = await readFile(response);
    const envData = await parseFromEnvFile(envFileData);

    return envData;
};

/**
 * Main function for updating Now from an Env file
 */
const getTokensAndUpdateNow = async () => {
    const envData = await getTokensFromEnv();
    return await updateMultipleNowTokens(envData);
};

module.exports = {
    getNowToken,
    getAccessToken,
    removeAccessToken,
    setNowToken,
    checkForAuthentication,
    getTokensAndUpdateNow,
    updateNowSecret
};
