const mockProcess = require('jest-mock-process');
const chalk = require('chalk');

describe('utils.js', () => {
    const utils = require('../../../src/lib/utils');

    describe('logs', () => {

        let testText;
        let mockStdout;

        beforeEach(() => {
            testText = 'test text';
            mockStdout = mockProcess.mockProcessStdout();
        })

        it('should print a string in yellow text', () => {
            utils.warningLog(testText);
            expect(mockStdout).toHaveBeenCalledWith(chalk.yellow(`--- ${testText}\n`));
        })

        it('should print a string in green text', () => {
            utils.successLog(testText);
            expect(mockStdout).toHaveBeenCalledWith(chalk.green(`--- ${testText}\n`));
        })

        it('should print a string in red text', () => {
            utils.errorLog(testText);
            expect(mockStdout).toHaveBeenCalledWith(chalk.red(`--- ${testText}\n`));
        })
    })

    describe('camelize', () => {
        it('should return a camelized string', () => {
            expect(utils.camelize('a name')).toEqual(
                'aName'
            );
        });
    });

    describe('parseFromEnvFile', () => {
        it('should return an arrayed version of a text', () => {
            expect(utils.parseFromEnvFile('var1=value1\nvar2=value2')).toEqual(
                [
                    { key: 'var1', value: 'value1' },
                    { key: 'var2', value: 'value2' }
                ]
            );
        });
    });

    describe('cleanseManifoldExport', () => {
        it('should clean manifold\'s export file', () => {
            expect(utils.cleanseManifoldExport('var1=value1\nvar2=value2\n\n')).toEqual(
                'var1=value1\nvar2=value2'
            );
        });
    });

    describe('spinner', () => {
        it('should write \n when there is no passed data when stopping it', () => {
            const mockStdout = mockProcess.mockProcessStdout();
            const spinner = new utils.spinner;
            spinner.stop();
            expect(mockStdout).toHaveBeenCalledWith('\n');
        })
    })
});
