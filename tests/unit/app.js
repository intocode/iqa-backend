const app = require('../../src/app');

describe('app', () => {
  it('must be an express app', () => {
    expect(app).toBeInstanceOf(Function);
    expect(app).toHaveProperty('use');
    expect(app.use).toBeInstanceOf(Function);
    expect(app._router.stack).toBeInstanceOf(Array);
  });
});
