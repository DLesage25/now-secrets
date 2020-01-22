const mockedSpawn = require('mock-spawn')();
const inquirer = require('inquirer')
const mockFs = require('mock-fs');
require('child_process').spawn = mockedSpawn;

const manifold = require('../../../src/lib/manifold');

describe('manifold.js', () => {

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

    describe('writeEnvsToFileFromManifold', () => {

        it('should let us know when there is an error while listing our manifold envs', async () => {
            const errorMessage = 'Error';
            inquirer.prompt = () => Promise.resolve({
                pathName: '.falsyPath'
            })
            mockedSpawn.sequence.add(function () {
                this.stderr.write(errorMessage)
            });

            try {
                await manifold.writeEnvsToFileFromManifold();
            } catch (err) {
                expect(err).toBe(errorMessage);
            }
        });

        it('should write envs into file', async () => {
            const pathName = '.path';
            const manifoldEnvs = 'varName1=varValue1\nvarName2=varValue2';
            inquirer.prompt = () => Promise.resolve({
                pathName
            })
            mockedSpawn.sequence.add(function () {
                this.stdout.write(manifoldEnvs)
            });
            mockFs({
                '.path': ''
            });

            const result = await manifold.writeEnvsToFileFromManifold();
            expect(result).toBe(true);
            mockFs.restore()
        });

    })

    describe('askForResource', () => {
        it('should let us know when there is an error while listing our manifold resources', async () => {
            const errorMessage = 'Error';
            mockedSpawn.sequence.add(function () {
                this.stderr.write(errorMessage)
            });

            try {
                await manifold.askForResource();
            } catch (err) {
                expect(err).toBe(errorMessage);
            }
        });

        it('should list all of the available resources within Manifold and ask the user for its preferred one', async () => {
            mockedSpawn.sequence.add(function () {
                this.stdout.write('list of resources')
            });

            const manifoldResource = 'preferred resource';

            inquirer.prompt = () => Promise.resolve({
                manifoldResource
            })

            const result = await manifold.askForResource();

            expect(result).toBe(manifoldResource);
        });
    })

    describe('addEnvToResource', () => {
        it('should add a new env into the desired resource', async () => {
            const resourceName = 'resource name';
            mockedSpawn.sequence.add(function () {
                this.stdout.write(resourceName)
            });
            const result = await manifold.addEnvToResource('keyName=keyValue', resourceName);
            expect(result).toBe(true);
        })

        it('should not add a new env into the desired resource', async () => {
            const error = 'error message';
            mockedSpawn.sequence.add(function () {
                this.stderr.write(error)
            });
            try {
                await manifold.addEnvToResource('keyName=keyValue', 'resourceName')
            } catch (err) {
                expect(err).toBe(error)
            }
        })
    })

    describe('writeEnvsToManifoldFromFile', () => {
        it('should write envs to manifold from file', async () => {
            inquirer.prompt = () => Promise.resolve({
                pathName: '.path',
                manifoldResource: 'testResource'
            })
            mockFs({
                '.path': 'varName1=varValue1\nvarName2=varValue2'
            });
            mockedSpawn.sequence.add(function () {
                this.stdout.write('listed env resources from manifold')
            });
            mockedSpawn.sequence.add(function () {
                this.stdout.write('added env to manifold')
            });
            mockedSpawn.sequence.add(function () {
                this.stdout.write('added env to manifold')
            });
            const result = await manifold.writeEnvsToManifoldFromFile();
            expect(result).toEqual([true, true])
            mockFs.restore();
        })

        it('prevents writting envs if something breaks within the process', async () => {
            inquirer.prompt = () => Promise.resolve({
                pathName: '.path',
                manifoldResource: 'testResource'
            })

            await expect(manifold.writeEnvsToManifoldFromFile()).rejects.toThrow('no such file or directory');
        })
    })

});
