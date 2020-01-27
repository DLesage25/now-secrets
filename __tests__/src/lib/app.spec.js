const inquirer = require('inquirer')
const mockFs = require('mock-fs');
const mockedSpawn = require('mock-spawn')();
require('child_process').spawn = mockedSpawn;


describe('app.js', () => {
    const app = require('../../../src/lib/app');

    describe('ImportFromManifoldIntoEnvFile', () => {

        beforeEach(() => {
            mockFs.restore()
        })

        it('should import envs into a file from Manifold', async () => {
            // logging in
            mockedSpawn.sequence.add(function () {
                this.stderr.write('You\'re already logged in!\n')
            });
            // switching to prod env
            mockedSpawn.sequence.add(mockedSpawn.simple(0));
            // writting envs to file from Manifold
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
            // ------
            const result = await app.ImportFromManifoldIntoEnvFile()
            expect(result).toBe(true)
        });

        it('should handle errors when importing envs into file from Manifold', async () => {
            mockedSpawn.sequence.add(mockedSpawn.simple(1));
            const result = await app.ImportFromManifoldIntoEnvFile()
            expect(result).toBe(false)
        });
    });

    describe('UpdateManifoldFromEnvFile', () => {
        it('should update env vars within Manifold from a file', async () => {
            // logging in
            mockedSpawn.sequence.add(function () {
                this.stderr.write('You\'re already logged in!\n')
            });
            // switching to prod env
            mockedSpawn.sequence.add(mockedSpawn.simple(0));
            // writting envs to manifold from file
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
            // ------
            const result = await app.UpdateManifoldFromEnvFile()
            expect(result).toBe(true)
        });

        it('should handle errors when importing envs into Manifold from file', async () => {
            mockedSpawn.sequence.add(mockedSpawn.simple(1));
            const result = await app.UpdateManifoldFromEnvFile()
            expect(result).toBe(false)
        });
    });

    describe('UpdateNowFromEnvFile', () => {
        it('should update now from env file', () => {
            expect(app.UpdateNowFromEnvFile()).toEqual(Promise.resolve());
        });

        it('should handle errors when updating now from env file', async () => {
            mockedSpawn.sequence.add(mockedSpawn.simple(1));
            const result = await app.UpdateNowFromEnvFile()
            expect(result).toBe(false)
        });
    });

});
