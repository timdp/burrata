import serializeErrorUnsafe from 'serialize-error'
import { ERROR_PROPERTIES } from './constants'

export const noop = () => {}

export const randomId = () => '' + (1e7 + Math.floor(Math.random() * 9e7))

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

export const describe = (inst, props = []) =>
  inst.constructor.name +
  '{' +
  props.map(name => `${name}=${inst[name]}`).join(',') +
  '}'
