import { sin, cos, ops } from './math'

const isVector = (x) => x instanceof Array && typeof x[0] === 'number'
const isMatrix = (x) => x instanceof Array && x[0] instanceof Array && typeof x[0][0] === 'number'

// Rotation Matrix
export const R = (theta) => [
  [cos(theta), -sin(theta)],
  [sin(theta),  cos(theta)],
]

export const scale = (k, A) => A.map(row => row.map(elem => k * elem))

export const product = (A, B) => {
  if (isVector(B)) {
    return [
      A[0][0] * B[0] + A[0][1] * B[1],
      A[1][0] * B[0] + A[1][1] * B[1],
    ]
  } else if (isMatrix(B)) {
    const result = [[undefined, undefined], [undefined, undefined]]
    return result.map((_, i) => result.map((__, j) => A[i][0] * B[0][j] + A[i][1] * B[1][j]))
  }
  throw new Error('What are you trying to do?')
}

const matrixOperation = (A, B, op) => [
  [op(A[0][0], B[0][0]), op(A[0][1], B[0][1])],
  [op(A[1][0], B[1][0]), op(A[1][1], B[1][1])],
]

export const sub = (A, B) => matrixOperation(A, B, ops['-'])
export const add = (A, B) => matrixOperation(A, B, ops['+'])

export default {
  R,
  add,
  product,
  scale,
  sub,
}
