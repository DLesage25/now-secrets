describe('form.js', () => {
    const form = require('../../../src/lib/form');

    describe('validate', () => {
        it('should mark it as a valid string', () => {
            expect(form.validate('string')).toBe(true);
        });
        it('should mark it as an invalid string', () => {
            expect(form.validate('')).toBe('Please check your input value.');
        });
    });

});
