const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd());
    },
    directoryExists: filePath => {
        return fs.existsSync(filePath);
    },
    createReplaceFile: name => {
        return fs.openSync(name, 'w');
    },
    writeFile: async (filePath, data) => {
        return new Promise((resolve, reject) => {
            const literalPath = `${process.cwd()}/${filePath}`;
            fs.writeFile(literalPath, data, (err) => {
                if (err) {
                    reject(`Error while writting on ${filePath}: ${err}`);
                }
                resolve(true);
            });
        });
    },
    readFile: async (filePath) => {
        return new Promise((resolve, reject) => {
            const literalPath = `${process.cwd()}/${filePath}`;
            fs.readFile(literalPath, "utf8", (err, data) => {
                if (err) {
                    reject(`Error while reading ${filePath}: ${err}`);
                }
                resolve(data)
            });
        });
    }
};
