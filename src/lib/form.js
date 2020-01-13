const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
    mainMenu: () => {
        const questions = [
            {
                type: 'list',
                name: 'ignore',
                message: 'Please select an option:',
                choices: [
                    'Import from NOW into .env file',
                    'Import from manifold into .env file',
                    'Update NOW from .env file',
                    'Update manifold from .env file',
                    'Update NOW from manifold (Beta)'
                ]
            }
        ];
        return inquirer.prompt(questions);
    },
    askForNowToken: () => {
        const questions = [
            {
                type: 'password',
                name: 'nowToken',
                message: 'Please enter a Now API token',
                validate: value => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askForResource: () => {
        const questions = [
            {
                type: 'text',
                name: 'manifoldResource',
                message: 'Please your desired Manifold resource name.',
                validate: value => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    }
};
