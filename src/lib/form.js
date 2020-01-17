const inquirer = require('inquirer');

const validate = value => {
    if (value.length) {
        return true;
    } else {
        return 'Please check your input value.';
    }
};

module.exports = {
    mainMenu: () => {
        const questions = [
            {
                type: 'list',
                name: 'selectedFlow',
                message: 'Please select an option:',
                choices: [
                    '1. Update Now from .env file',
                    '2. Import from Manifold into .env file',
                    '3. Update Manifold from .env file',
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
                message: 'Please enter a Now API token',
                validate
            }
        ];
        return inquirer.prompt(questions);
    },
    askForPath: (message, defaultPath) => {
        const questions = [
            {
                type: 'text',
                name: 'pathName',
                message,
                validate,
                default: defaultPath
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
                validate
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
