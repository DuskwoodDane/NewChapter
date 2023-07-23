const isObject = (data) => !!(data && typeof data === 'object')

let activeEffect = null
let targetMap = new WeakMap()

const track = (target, key) => {
  let depsMap = targetMap.get(target)

  if (!depsMap) targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  trackEffect(dep)
}

const trackEffect = (dep) => {
  if (!dep.has(activeEffect)) dep.add(activeEffect)
}

const trigger = (target, key) => {
  const depsMap = targetMap.get(target)

  if (depsMap) {
  }
}


export const reactive = (data) => {
  if (!isObject(data)) return

  return new Proxy(data, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)

      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver)

      return true
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)

      return res
    },
    has(target, key) {
      const res = Reflect.has(target, key)

      return res
    },
    ownKeys(target) {
      return Reflect.ownKeys(target)
    }
  })
}