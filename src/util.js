import serializeErrorUnsafe from 'serialize-error'

const ERROR_PROPERTIES = ['name', 'stack']

export const noop = () => {}

export const serializeError = err => {
  let error = { message: '' + err }
  try {
    error = serializeErrorUnsafe(err)
  } catch (_) {}
  return error
}

export const deserializeError = error => {
  const err = new Error(error.message)
  ERROR_PROPERTIES.forEach(name => {
    const value = error[name]
    try {
      Object.defineProperty(err, name, {
        configurable: true,
        enumerable: false,
        value,
        writable: true
      })
    } catch (_) {}
  })
  return err
}
