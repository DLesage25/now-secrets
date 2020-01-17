const inquirer = require('inquirer');

module.exports = {
    mainMenu: () => {
        const questions = [
            {
                type: 'list',
                name: 'selectedFlow',
                message: 'Please select an option:',
                choices: [
                    '1. Import from Manifold into .env file',
                    '2. Update Now from .env file',
                    '3. Update manifold from .env file',
                    '4. Update Now from Manifold (Beta)'
                ]
            }
        ];
        return inquirer.prompt(questions);
    },
    askForNowToken: () => {
        const message = 'Please enter a Now API token';
        const questions = [
            {
                type: 'password',
                name: 'nowToken',
                message,
                validate: value => {
                    if (value.length) return true;
                    return message;
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askForPath: message => {
        const questions = [
            {
                type: 'text',
                name: 'pathName',
                message,
                validate: value => {
                    if (value.length) return true;
                    return message;
                },
                default: '.env'
            }
        ];
        return inquirer.prompt(questions);
    },
    askForResource: () => {
        const message = 'Please enter your desired Manifold resource name:';
        const questions = [
            {
                type: 'text',
                name: 'manifoldResource',
                message,
                validate: value => {
                    if (value.length) return true;
                    return message;
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askToSelectFromList: (message, list) => {
        const questions = [
            {
                type: 'list',
                name: 'response',
                message,
                choices: list
            }
        ];
        return inquirer.prompt(questions);
    },
    askToSelectCheckboxes: (message, list) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'response',
                message,
                choices: list
            }
        ];
        return inquirer.prompt(questions);
    }
};
