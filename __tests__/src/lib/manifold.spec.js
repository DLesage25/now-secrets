const mockedSpawn = require('mock-spawn')();
const inquirer = require('inquirer')
require('child_process').spawn = mockedSpawn;

describe('manifold.js', () => {
    let manifold = require('../../../src/lib/manifold');

    describe('login', () => {

        it('identifies that we were not able to log in', async () => {
            mockedSpawn.sequence.add(function () {
                this.stderr.write('nothing')
            });

            // this should always fall in the catch section as per
            // the login rejection within manifold.js
            try {
                await manifold.login();
            } catch (err) {
                expect(err).toBe('Failed logging into Manifold')
            }
        });

        it('identifies that we are logged into manifold already', async () => {
            mockedSpawn.sequence.add(function () {
                this.stderr.write('You\'re already logged in!\n')
            });
            const result = await manifold.login();
            expect(result).toBe(true);
        });

        it('should exit the login process successfully', async () => {
            mockedSpawn.sequence.add(mockedSpawn.simple(0));
            const result = await manifold.login();
            expect(result).toBe(true);
        });
    });

    describe('switchToProdEnv', () => {

        it('should let us know when there is an error while switching to PartnerHero\'s environment within Manifold', async () => {
            const errorMessage = 'Error';
            mockedSpawn.sequence.add(function () {
                this.stderr.write(errorMessage)
            });

            try {
                await manifold.switchToProdEnv();
            } catch (err) {
                expect(err.toString()).toBe(errorMessage);
            }
        });

        it('should switch us over to partnerhero\'s environment within Manifold', async () => {
            mockedSpawn.sequence.add(mockedSpawn.simple(0));
            const result = await manifold.switchToProdEnv();
            expect(result).toBe(true);
        });

    });

    describe('switchToProdEnv', () => {

        it('should let us know when there is an error while switching to PartnerHero\'s environment within Manifold', async () => {
            const errorMessage = 'Error';
            mockedSpawn.sequence.add(function () {
                this.stderr.write(errorMessage)
            });

            try {
                await manifold.switchToProdEnv();
            } catch (err) {
                expect(err.toString()).toBe(errorMessage);
            }
        });

        it('should switch us over to partnerhero\'s environment within Manifold', async () => {
            mockedSpawn.sequence.add(mockedSpawn.simple(0));
            const result = await manifold.switchToProdEnv();
            expect(result).toBe(true);
        });

    });

    describe('writeEnvsToManifoldFromFile', () => {
        
        it ('should not find file pointed by user', async () => {
            const answers = {
                pathName: '.test-env'
            }
            inquirer.prompt = (questions) => Promise.resolve(answers)
            await expect(manifold.writeEnvsToManifoldFromFile()).rejects.toThrowError('ENOENT: no such file or directory');
        })

    })

});
