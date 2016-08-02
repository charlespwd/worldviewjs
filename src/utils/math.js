export const PI = Math.PI
export const sin = (degrees) => Math.sin(degrees / 180 * PI)
export const cos = (degrees) => Math.cos(degrees / 180 * PI)
export const ops = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  'avg': avg,
}
