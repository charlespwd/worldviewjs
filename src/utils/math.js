export const PI = Math.PI
export const sin = (degrees) => Math.sin(degrees / 180 * PI)
export const cos = (degrees) => Math.cos(degrees / 180 * PI)
export const avg = (a, b) => (a + b) / 2
export const delta = (a, b) => a - b
export const ops = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  avg,
}
