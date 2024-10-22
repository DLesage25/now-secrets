'use strict';
const CLI = require('clui');
const chalk = require('chalk');

const camelize = str => {
    str = str.replace(/[0-9]/g, '');
    return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
};

const warningLog = str => process.stdout.write(chalk.yellow(`--- ${str}\n`));
const successLog = str => process.stdout.write(chalk.green(`--- ${str}\n`));
const errorLog = str => process.stdout.write(chalk.red(`--- ${str}\n`));

const Spinner = CLI.Spinner;

class spinner {
    constructor(loadingText) {
        this.spinnerInstance = new Spinner(loadingText);
        this.start = () => {
            this.spinnerInstance.start();
            process.stdout.write('\n');
        };
        this.stop = (data) => {
            this.spinnerInstance.stop();
            if (data)
                process.stdout.write(data);
            else
                process.stdout.write('\n');
        };
    }
}

const parseFromEnvFile = envFileData =>
    envFileData.split('\n').map(string => ({
        key: string.split('=')[0],
        value: string.split('=')[1]
    }));

const cleanseManifoldExport = data =>
    data
        .toString()
        .split('\n')
        .filter(env => env !== '')
        .join('\n')

module.exports = {
    camelize,
    warningLog,
    successLog,
    errorLog,
    spinner,
    parseFromEnvFile,
    cleanseManifoldExport
};
