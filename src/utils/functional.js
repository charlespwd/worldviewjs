export const flow = (...args) => x => {
  const [f, ...rest] = args
  if (f) {
    return flow(...rest)(f(x))
  }
  return x
}

export const setState = (state, key, value) => ({
  ...state,
  [key]: value,
})
