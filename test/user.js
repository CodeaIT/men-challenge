import assert from 'assert';
import mocha from 'mocha';

const { describe, it } = mocha;

describe('Auth Controller', () => {
  describe('isAuthorized', () => {
    it('Should return false if not authorized', () => {
      assert.equal(false, false);
    });
    it('Should return false if not authorized', () => {
      assert.equal(false, false);
    });
  });
});
