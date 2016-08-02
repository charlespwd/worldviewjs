import { ops } from './math'

const operate = (op) => (v, u) => v.map((_, i) => op(v[i], u[i]))

export const scale = (k, v) => v.map(x => k * x)
export const add = operate(ops['+'])
export const sub = operate(ops['-'])
export const min = operate(Math.min)
export const max = operate(Math.max)
export const bounded = (u, v, w) => min(max(u, v), w)

export default {
  add,
  bounded,
  max,
  min,
  scale,
  sub,
}
