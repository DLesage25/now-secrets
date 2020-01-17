const chalk = require('chalk');
const inquirer = require('inquirer');

const camelize = str => {
    str = str.replace(/[0-9]/g, '');
    return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
};

const warningLog = str => console.log(chalk.yellow(`--- ${str}`));
const successLog = str => console.log(chalk.green(`--- ${str}`));
const errorLog = str => console.log(chalk.red(`--- ${str}`));

const loader = loadingText => {
    this.loader = [
        `/ ${loadingText}`,
        `| ${loadingText}`,
        `\\ ${loadingText}`,
        `- ${loadingText}`
    ];
    this.i = loader.length;
    this.loadingBar = new inquirer.BottomBar({ bottomBar: loader[this.i % 4] });
    this.refreshInterval = setInterval(() => {
        this.loadingBar.updateBottomBar(loader[this.i++ % 4]);
    }, 300);
    this.end = endingText => {
        clearInterval(this.refreshInterval);
        this.loadingBar.updateBottomBar(`${endingText}\n`);
    };
};

const parseFromEnvFile = envFileData =>
    envFileData.split('\n').map(string => ({
        key: string.split('=')[0],
        value: string.split('=')[1]
    }));

module.exports = {
    camelize,
    warningLog,
    successLog,
    errorLog,
    loader,
    parseFromEnvFile
};
