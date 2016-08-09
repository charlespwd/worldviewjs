import { ops } from './math'

const operate = (op) => (v, u) => v.map((_, i) => op(v[i], u[i]))

export const scale = (k, v) => v.map(x => k * x)
export const add = operate(ops['+'])
export const sub = operate(ops['-'])
export const dotProduct = operate(ops['*'])
export const min = operate(Math.min)
export const max = operate(Math.max)
export const bounded = (u, v, w) => min(max(u, v), w)
export const norm = (v) => Math.sqrt(dotProduct(v, v).reduce(ops['+']))
export const normalize = (v) => scale(1 / norm(v), v)
export const zero = Object.freeze([0, 0])

export default {
  add,
  bounded,
  max,
  min,
  norm,
  normalize,
  scale,
  sub,
  zero,
}
