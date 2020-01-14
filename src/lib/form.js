const inquirer = require('inquirer');

module.exports = {
    mainMenu: () => {
        const questions = [
            {
                type: 'list',
                name: 'selectedFlow',
                message: 'Please select an option:',
                choices: [
                    '1. Import from Now into .env file',
                    '2. Import from Manifold into .env file',
                    '3. Update Now from .env file',
                    '4. Update manifold from .env file',
                    '5. Update Now from Manifold (Beta)'
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
    askForPath: (message) => {
        const questions = [
            {
                type: 'text',
                name: 'pathName',
                message,
                validate: value => {
                    if (value.length) {
                        return true;
                    } else {
                        return message;
                    }
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
                    if (value.length) {
                        return true;
                    } else {
                        return message;
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    }
};
