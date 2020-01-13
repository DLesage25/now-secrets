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
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    console.log(`Error while writting on ${filePath}: ${err}`);
                    reject(err);
                }
                resolve(true);
            });
        });
    },
    readFile: async (filePath) => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    console.log(`Error while reading ${filePath}: ${err}`);
                    reject(err);
                }
                resolve(data)
            });
        });
    }
};
