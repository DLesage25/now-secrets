const { spawn } = require('child_process');

const { writeFile, readFile } = require('./files');
const form = require('./form');
const { warningLog, successLog, spinner, cleanseManifoldExport } = require('./utils');

/**
 * This function will help us display a table
 * with the available resources within the Manifold project
 * this CLI is running on.
 */
const askForResource = () => {
    return new Promise((resolve, reject) => {
        const list = spawn('manifold', ['list'], { stdio: 'pipe' });
        const loading = new spinner('Getting available resources from Manifold')
        loading.start();

        list.stdout.on('data', async (data) => {
            loading.stop(data);
            const { manifoldResource } = await form.askForResource();
            resolve(manifoldResource);
        })
        list.stderr.on('data', (data) => {
            reject(data.toString());
        })
    })
}

/**
 * 
 * @param {string} env - format: envName=envValue
 * @param {string} resource - the selected manifold resource name
 */
const addEnvToResource = (env, resource) => {
    const [envName, envValue] = env.split('=');
    return new Promise((resolve, reject) => {
        const envSet = spawn('manifold', ['config', 'set', `${envName}=${envValue}`, '--resource', resource], { stdio: 'pipe' });

        envSet.stdout.on('data', async (data) => {
            resolve(true)
        })
        envSet.stderr.on('data', (data) => {
            reject(data.toString());
        })
    })
}

module.exports = {
    /**
     * This functions have to be exported for
     * testing purposes
     */
    askForResource,
    addEnvToResource,
    /**
     * This function will help us log into manifold
     * and catch any error while doing so
     */
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
                } else {
                    reject('Error while logging in')
                }
            });
        });
    },
    /**
     * This will help us switch to the user's PartnerHero environment
     * within Manifold
     */
    switchToProdEnv: () => {
        return new Promise((resolve, reject) => {
            warningLog('Switching to PartnerHero\'s environment')
            const switched = spawn('manifold', ['switch', 'partnerhero'], { stdio: 'pipe' });

            switched.stderr.on('data', (data) => {
                reject(data.toString());
            });

            switched.on('close', (code) => {
                if (code === 0) {
                    successLog('Switched to PartnerHero\'s environment successfully')
                    resolve(true);
                } else {
                    reject('Error while switching to prod env')
                }
            });
        })
    },
    /**
     * This function will help us to:
     * 1. Ask the user for a path on which he/she will like to write its env variables on
     * 2. Export all of the manifold env variables present within the current process
     * 3. Write them on the desired file
     */
    writeEnvsToFileFromManifold: async () => {
        const { pathName } = await form.askForPath('Please enter the path you would like your env file to be stored at (including file name):', '.env');
        return new Promise((resolve, reject) => {
            const exported = spawn('manifold', ['export'], { stdio: 'pipe' });

            exported.stderr.on('data', (data) => {
                reject(data.toString());
            });

            exported.stdout.on('data', async (data) => {
                await writeFile(pathName, cleanseManifoldExport(data))
                resolve(true);
            });

            exported.on('close', (code) => {
                if (code === 0) {
                    resolve(true);
                } else {
                    reject('Error while switching to prod env')
                }
            });
        })
    },
    /**
     * This function will help us to:
     * 1. Ask the user for a path on which he/she has its env variables stored on
     * 2. Read the desired file
     * 3. Ask the user for the desired resource he/she will like to write the envs on
     * 4. Add the envs to the desired manifold resources
     */
    writeEnvsToManifoldFromFile: async () => {
        const { pathName } = await form.askForPath('Please enter the path of the file you would like us to get envs from:', '.env');
        return new Promise(async (resolve, reject) => {
            try {
                const envs = await readFile(pathName);
                const resource = await askForResource();
                // converting to array and filtering out comments
                const filteredOutEnvs = envs.split('\n').filter(string => string.charAt(0) !== '#');
                const result = await Promise.all(filteredOutEnvs.map(env => {
                    return addEnvToResource(env, resource);
                }))
                // successLog(`Wrote ${filteredOutEnvs.length} envs into ${resource} successfully`)
                return resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
};