export const scaleVector = (k, v) => v.map(x => k * x)
export const addVectors = (v, u) => v.map((x, i) => x + u[i])
export const minusVectors = (v, u) => v.map((x, i) => x - u[i])
