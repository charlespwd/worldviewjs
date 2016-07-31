import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiStats from 'chai-stats'
chai.use(sinonChai)
chai.use(chaiStats)

if (typeof document === 'undefined') {
  global.document = {}
}
