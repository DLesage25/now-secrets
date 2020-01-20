const inquirer = require('inquirer')

describe('index.js', () => {
    const index = require('../../src/index');

    describe('main', () => {
        it('should run a flow', async () => {
            inquirer.prompt = () => Promise.resolve({
                selectedFlow: 'test Flow'
            })
            await expect(index.main()).toEqual(Promise.resolve());
        });
    });
});
