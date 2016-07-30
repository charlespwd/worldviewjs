import chai, { Assertion } from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

Assertion.addMethod('approxEqual', function approxEqual(X, epsilon = 1e16) {
  const actual = this._obj;

  new Assertion(actual).to.not.be.undefined

  if (typeof X === 'number') {
    new Assertion(actual).to.be.within(X - epsilon, X + epsilon)
  } else if (X instanceof Array) {
    X.forEach((x, i) => {
      new Assertion(actual[i]).to.be.approxEqual(x, epsilon)
    })
  } else {
    new Assertion(actual).to.be.a(typeof X)
  }
})
