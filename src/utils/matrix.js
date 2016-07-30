const PI = Math.PI
const sin = (degrees) => Math.sin(degrees / 180 * PI)
const cos = (degrees) => Math.cos(degrees / 180 * PI)

const ops = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

// Rotation Matrix
export const R = (theta) => [
  [cos(theta), -sin(theta)],
  [sin(theta),  cos(theta)],
]

export const matrixMultiply = (matrix, vector) => [
  matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
  matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
]

const matrixOperation = (A, B, op) => [
  [op(A[0][0], B[0][0]), op(A[0][1], B[0][1])],
  [op(A[1][0], B[1][0]), op(A[1][1], B[1][1])],
]

export const matrixSubtract = (A, B) => matrixOperation(A, B, ops['-'])
export const matrixAdd = (A, B) => matrixOperation(A, B, ops['+'])
