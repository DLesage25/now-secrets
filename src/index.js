#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const form = require('./lib/form');
const now = require('./lib/now');
// const github = require('./lib/github');
// const repo = require('./lib/repo');

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
    console.log('trying this out');
    let token = await now.getNowToken();
    console.log('token ' + JSON.stringify(token));
    // await form.mainMenu();
};

main();
