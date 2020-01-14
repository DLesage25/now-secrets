const { exec, spawn } = require('child_process');

const { writeFile, readFile } = require('./files');
const form = require('./form');
const { warningLog, successLog, errorLog } = require('./utils');

const askForResource = () => {
    return new Promise((resolve, reject) => {
        exec('manifold list', async (code, stdout, stderr) => {
            if (stderr !== '')
                return reject(stderr);
            console.log(stdout)
            const { manifoldResource } = await form.askForResource();
            resolve(manifoldResource);
        })
    })
}

const addEnvToResource = (env, resource) => {
    const [envName, envValue] = env.split('=');
    return new Promise((resolve, reject) => {
        exec(`manifold config set ${envName}=${envValue} --resource ${resource}`, (code, stdout, stderr) => {
            if (stderr !== '')
                reject(stderr);
            resolve(true);
        })
    })
}

module.exports = {
    login: () => {
        return new Promise((resolve, reject) => {
            warningLog('Logging into Manifold')
            // we need to pipe any error coming from Manifold
            // so for us to have access to its data
            // stdio: [stdin, stdout, err]
            const loggedIn = spawn('manifold', ['login'], { stdio: ['inherit', 'inherit', 'pipe'] });

            loggedIn.stderr.on('data', (data) => {
                const successMessageFromManifold = 'You\'re already logged in!\n';
                if (data.toString() == successMessageFromManifold) {
                    successLog('Logged into Manifold successfully')
                    return resolve(true);
                }
                reject({error: 'Failed logging into Manifold'})
            });

            loggedIn.on('close', (code) => {
                if (code === 0) {
                    successLog('Logged into Manifold successfully')
                    resolve(true)
                }
            });
        });
    },
    switchToProdEnv: () => {
        return new Promise((resolve, reject) => {
            warningLog('Switching to PartnerHero\'s environment')
            exec('manifold switch partnerhero', (code, stdout, stderr) => {
                if (stderr !== '')
                    reject({error: stderr});
                successLog('Switched to PartnerHero\'s snvironment successfully')
                resolve(true);
            })
        })
    },
    writeEnvsToFileFromManifold: async () => {
        const { pathName } = await form.askForPath('Please enter the path you would like your env file to be stored at (including file name):');
        return new Promise((resolve, reject) => {
            exec('manifold export', async (code, stdout, stderr) => {
                if (stderr !== '')
                    reject({error: stderr});
                
                try {
                    await writeFile(pathName, stdout)
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            })
        })
    },
    writeEnvsToManifoldFromFile: (filePath) => {
        return new Promise(async (resolve, reject) => {
            try {
                const envs = await readFile(filePath);
                const resource = await askForResource();
                //converting to array and filtering out comments
                const filteredOutEnvs = envs.split('\n').filter(string => string.charAt(0) !== '#');
                await Promise.all(filteredOutEnvs.map(env => {
                    return addEnvToResource(env, resource);
                }))
                resolve(true);
            } catch (err) {
                reject(err);
            }
        })
    }
};