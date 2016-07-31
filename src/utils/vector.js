export const scale = (k, v) => v.map(x => k * x)
export const add = (v, u) => v.map((x, i) => x + u[i])
export const sub = (v, u) => v.map((x, i) => x - u[i])

export default {
  scale,
  add,
  sub,
}
