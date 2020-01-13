const { exec, spawn } = require('child_process');

const { writeFile, readFile } = require('./files');
const form = require('./form');

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
        exec(`manifold config set ${envName}=${envValue} --resource ${resource}`, async (code, stdout, stderr) => {
            if (stderr !== '')
                reject(stderr);
            resolve(true);
        })
    })
}

module.exports = {
    login: () => {
        return new Promise((resolve) => {
            const loggedIn = spawn('manifold', ['login'], { stdio: 'inherit' });
            loggedIn.on('close', () => {
                //we are always resolving true
                //because if the log in process fails then
                //manifold breaks the flow itself
                resolve(true)
            });
        });
    },
    switchToProdEnv: () => {
        return new Promise((resolve, reject) => {
            exec('manifold switch partnerhero', (code, stdout, stderr) => {
                if (stderr !== '')
                    reject(stderr);
                resolve(true);
            })
        })
    },
    writeEnvsToFileFromManifold: (filePath) => {
        return new Promise((resolve, reject) => {
            exec('manifold export', async (code, stdout, stderr) => {
                if (stderr !== '')
                    reject(stderr);
                
                try {
                    await writeFile(filePath, stdout)
                    resolve(true);
                } catch (err) {
                    reject(err);
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