const instances = {}

const has = (ns, id) =>
  instances.hasOwnProperty(ns) && instances[ns].hasOwnProperty(id)

const get = (ns, id) => (has(ns, id) ? instances[ns][id] : null)

const set = (ns, id, node) => {
  if (has(ns, id)) {
    throw new Error(`Node ${ns}:${id} already registered`)
  }
  if (!instances.hasOwnProperty(ns)) {
    instances[ns] = {}
  }
  instances[ns][id] = node
}

const Nodes = {
  has,
  get,
  set
}

export { Nodes }
