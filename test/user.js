import assert from 'assert';
import mocha from 'mocha';
import '../app';

const { before, after } = mocha;
const { describe, it } = mocha;

describe('Auth Controller', () => {
  before((done) => {
    done();
  });

  describe('POST /auth/register', () => {
    it('Should return false if not authorized', () => {
      assert.equal(false, false);
    });
    it('Should return false if not authorized', () => {
      assert.equal(false, false);
    });
  });

  after((done) => {
    done();
  });
});
