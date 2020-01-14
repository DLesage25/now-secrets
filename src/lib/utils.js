const chalk = require('chalk');

const camelize = str => {
    str = str.replace(/[0-9]/g, '');
    return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
};

const warningLog = str => console.log(chalk.yellow(`--- ${str}`))
const successLog = str => console.log(chalk.green(`--- ${str}`))
const errorLog = str => console.log(chalk.red(`--- ${str}`))

module.exports = {
    camelize,
    warningLog,
    successLog,
    errorLog
};
