'use strict';

const chalk = require('chalk');
const inquirer = require('inquirer');

const camelize = str => {
    str = str.replace(/[0-9]/g, '');
    return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
};

const warningLog = str => console.log(chalk.yellow(`--- ${str}`));
const successLog = str => console.log(chalk.green(`--- ${str}`));
const errorLog = str => console.log(chalk.red(`--- ${str}`));

class loader {
    constructor(loadingText, stream) {
        warningLog(loadingText);
        this.loader = [`/`, `|`, `\\`, `-`];
        this.i = loader.length;
        this.loadingBar = new inquirer.ui.BottomBar({
            bottomBar: this.loader[this.i % 4]
        });
        this.refreshInterval = setInterval(() => {
            this.loadingBar.updateBottomBar(this.loader[this.i++ % 4]);
        }, 300);

        stream.stdout.pipe(this.loadingBar.log);
    }
    // logging any stdin, stdout, stderr or what not text stream at the same time
    // you call this end() function isn't necessary
    // as this function will do it for you
    // when firing updateBottomBar()
    end(endingText) {
        clearInterval(this.refreshInterval);
        this.loadingBar.updateBottomBar(chalk.green(`--- ${endingText}\n`)); //emptying our BottomBar
    }
}

module.exports = {
    camelize,
    warningLog,
    successLog,
    errorLog,
    loader,
    parseFromEnvFile
};
