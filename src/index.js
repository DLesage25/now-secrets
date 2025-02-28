#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const form = require('./lib/form');
const utils = require('./lib/utils');
const app = require('./lib/app');

clear();

console.log(
    chalk.yellow(
        figlet.textSync('Now-Secrets', {
            font: 'Slant',
            horizontalLayout: 'universal smushing'
        })
    )
);

const main = async () => {
    let { selectedFlow } = await form.mainMenu();
    selectedFlow = utils.camelize(selectedFlow);
    return await app[selectedFlow]();
};

main();

module.exports = {
    main
}