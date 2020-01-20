describe('app.js', () => {
    const app = require('../../../src/lib/app');

    describe('ImportFromManifoldIntoEnvFile', () => {
        it('should import envs into a file from Manifold', () => {
            expect(app.ImportFromManifoldIntoEnvFile()).toEqual(Promise.resolve());
        });

        it('should handle errors when importing envs into file from Manifold', () => {
            expect(app.ImportFromManifoldIntoEnvFile()).toEqual(Promise.reject());
        });
    });

    describe('UpdateManifoldFromEnvFile', () => {
        it('should update env vars within Manifold from a file', () => {
            expect(app.UpdateManifoldFromEnvFile()).toEqual(Promise.resolve());
        });

        it('should handle errors when importing envs into Manifold from file', () => {
            expect(app.UpdateManifoldFromEnvFile()).toEqual(Promise.reject());
        });
    });

    describe('UpdateNowFromEnvFile', () => {
        it('should update now from env file', () => {
            expect(app.UpdateNowFromEnvFile()).toEqual(Promise.resolve());
        });

        it('should handle errors when updating now from env file', () => {
            expect(app.UpdateNowFromEnvFile()).toEqual(Promise.reject());
        });
    });

});
