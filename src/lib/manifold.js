const { exec, spawn } = require('child_process');

const { writeFile, readFile } = require('./files');
const form = require('./form');
const { warningLog, successLog, loader } = require('./utils');

const askForResource = () => {
    return new Promise((resolve, reject) => {
        const list = spawn('manifold', ['list'], { stdio: 'pipe' });
        const loading = new loader('Getting available resources from Manifold', list)

        list.stdout.on('data', async (data) => {
            loading.end('Finished getting available resources')
            const { manifoldResource } = await form.askForResource();
            resolve(manifoldResource);
        })
        list.stderr.on('data', (data) => {
            reject(data);
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
            // if we don't pipe it then, on('data') would always be
            // falsy
            // stdio: [stdin, stdout, err]
            const loggedIn = spawn('manifold', ['login'], { stdio: ['inherit', 'inherit', 'pipe'] });

            loggedIn.stderr.on('data', (data) => {
                const successMessageFromManifold = 'You\'re already logged in!\n';
                if (data.toString() == successMessageFromManifold) {
                    successLog('Logged into Manifold successfully')
                    return resolve(true);
                }
                reject('Failed logging into Manifold')
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
                    reject(stderr);
                successLog('Switched to PartnerHero\'s snvironment successfully')
                resolve(true);
            })
        })
    },
    writeEnvsToFileFromManifold: async () => {
        const { pathName } = await form.askForPath('Please enter the path you would like your env file to be stored at (including file name):', '.env');
        return new Promise((resolve, reject) => {
            exec('manifold export', async (code, stdout, stderr) => {
                if (stderr !== '')
                    reject(stderr);

                // preventing the export to have unnecessary line breaks
                const cleansedExport = 
                    stdout
                    .split('\n')
                    .filter(env => env !== '').
                    join('\n');
                
                try {
                    await writeFile(pathName, cleansedExport)
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            })
        })
    },
    writeEnvsToManifoldFromFile: async () => {
        const { pathName } = await form.askForPath('Please enter the path of the file you would like us to get envs from:', '.env');
        return new Promise(async (resolve, reject) => {
            try {
                const envs = await readFile(pathName);
                const resource = await askForResource();
                //converting to array and filtering out comments
                const filteredOutEnvs = envs.split('\n').filter(string => string.charAt(0) !== '#');
                await Promise.all(filteredOutEnvs.map(env => {
                    return addEnvToResource(env, resource);
                }))
                successLog(`Wrote ${filteredOutEnvs.length} envs into ${resource} successfully`)
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }
};