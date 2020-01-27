const fs = require('fs');

jest.mock('fs');

describe('Files.js', () => {
    let myFunctions = require('../../../src/lib/files');

    describe('Files.js', () => {
        describe('getCurrentDirectoryBase', () => {
            it('should return the current working directory', () => {
                expect(myFunctions.getCurrentDirectoryBase()).toEqual(
                    'now-secrets'
                );
            });
        });

        describe('directoryExists', () => {
            it('should return truthy for an existent directory', () => {
                fs.existsSync = jest.fn().mockReturnValue(() => true);
                expect(myFunctions.directoryExists('x')).toBeTruthy();
            });
            it('should return falsy for a non-existent directory', () => {
                fs.existsSync = jest.fn().mockReturnValue(false);
                expect(myFunctions.directoryExists('random')).toBeFalsy();
            });
        });

        describe('writeFile', () => {
            it('should write to a file', async () => {
                fs.writeFile.mockImplementation((_, _2, callback) =>
                    callback(null)
                );

                expect(await myFunctions.writeFile('test')).toBeTruthy();
            });

            it('should return an error if wrong path is sent', async () => {
                fs.writeFile.mockImplementation((_, _2, callback) =>
                    callback('mock error')
                );
                myFunctions.writeFile('test').catch(e => {
                    expect(e).toEqual('mock error');
                });
            });
        });

        describe('readFile', () => {
            it('should read the contents of a provided file', async () => {
                fs.readFile.mockImplementation((_, _2, callback) =>
                    callback(null, 'test')
                );

                expect(await myFunctions.readFile('test')).toEqual('test');
            });
            it('should return an error if the file does not exist', async done => {
                fs.readFile.mockImplementation((_, _2, callback) =>
                    callback('error', null)
                );

                await myFunctions.readFile('test').catch(e => {
                    expect(e).toEqual('error');
                    done();
                });
            });
        });

        describe('getFileList', () => {
            it('should return the list of files in a directory', async () => {
                fs.readdir.mockImplementation((_, callback) =>
                    callback(null, 'test')
                );
                await myFunctions.getFileList('test').then(data => {
                    expect(data).toEqual('test');
                });
            });
            it('should return an error if chosen file is not a directory', async () => {
                fs.readdir.mockImplementation((_, callback) =>
                    callback('error', null)
                );
                await myFunctions.getFileList('test').catch(e => {
                    expect(e).toEqual('error');
                });
            });
        });
    });
});
