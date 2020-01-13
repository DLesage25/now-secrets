const inquirer = require('inquirer');
const files = require('./files');

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
