describe('utils.js', () => {
    const utils = require('../../../src/lib/utils');

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
                    {key: 'var1', value: 'value1'},
                    {key: 'var2', value: 'value2'}
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
});
