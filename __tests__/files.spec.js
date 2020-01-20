describe('Files.js', () => {
    let myFunctions = require('../src/lib/files');

    describe('getCurrentDirectoryBase', () => {
        it('should return the current working directory', () => {
            return expect(myFunctions.getCurrentDirectoryBase()).toEqual(
                'now-secrets'
            );
        });
    });

    describe('directoryExists', () => {
        it('should return truthy for an existent directory', () => {
            return expect(myFunctions.directoryExists('src')).toBeTruthy();
        });
        it('should return falsy for a non-existent directory', () => {
            return expect(myFunctions.directoryExists('random')).toBeFalsy();
        });
    });

    describe('readFile', () => {
        it('should read the contents of a provided file', () => {
            return expect(myFunctions.readFile('.prettierrc')).resolves.toEqual(
                '{\n    "useTabs": false,\n    "tabWidth": 4,\n    "singleQuote": true\n}\n'
            );
        });
        it('should return an error if the file does not exist', () => {
            return expect(myFunctions.readFile('someFile')).rejects.toThrow(
                /no such file/
            );
        });
    });

    describe('getFileList', () => {
        it('should return the list of files in a directory', () => {
            return expect(myFunctions.getFileList('src')).resolves.toEqual([
                'index.js',
                'lib'
            ]);
        });
    });
});
