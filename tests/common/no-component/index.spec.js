const markoTester = require('../../..');

it('should throw an error when no component is found', () => {
  expect(() => markoTester('./index.marko')).toThrowError('Cannot find specified component at "./index.marko".');
});
