const isObject = (data) => !!(data && typeof data === 'object')

let activeEffect = null // 正在活跃的副作用
let targetMap = new WeakMap();

// get操作保存副作用函数至WeakMap中
const track = (target, key) => {
  // targetMap键值对形式：{ {}: value}
  let depsMap = targetMap.get(target)

  // 初始化depsMap
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  trackEffect(dep)
}

// 保存副作用函数至set
const trackEffect = (dep) => {
  // 判断targetMap的对象属性中是否存在activeEffect(更新副作用函数), 存在则保存副作用函数
  if (!dep.has(activeEffect)) dep.add(activeEffect)
}

// 执行副作用函数
const trigger = (target, key) => {
  const depsMap = targetMap.get(target) // 判断当前map中的对象属性是否存在

  if (depsMap) {
    // 循环set并执行run => 将实例对象传入activeEffect并执行副作用函数
    (depsMap.get(key) || []).forEach(effect => effect.run())
  }
}

const effect = (fn, options = {}) => {
  let __effect = new ReactiveEffect(fn)
  options.lazy || __effect.run()
  return __effect

}

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    return this.fn()
  }
}


const update = (ins, el) => {
  el.innerHTML = ins.render()
}

export const mount = (ins, el) => {
  effect(() => {
    ins.$data && update(ins, el)
  })

  ins.$data = ins.setup()
  update(ins, el)
}

export const reactive = (data) => {
  if (!isObject(data)) return

  return new Proxy(data, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      track(target, key)
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return true
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      trigger(target, key)
      return res
    },
    has(target, key) {
      const res = Reflect.has(target, key)
      track(target, key)
      return res
    },
    ownKeys(target) {
      return Reflect.ownKeys(target)
    }
  })
}

export const computed = (fn) => {
  let __computed
  const e = effect(fn, { lazy: true })
  __computed = {
    get value() {
      return e.run()
    }
  }
  return __computed
}

export const ref = (init) => {
  class RefImpl {
    constructor(init) {
      this.__value = init
    }
    get value() {
      track(this, 'value')
      return this.__value
    }

    set value(newVal) {
      this.__value = newVal
      trigger(this, 'value')
    }
  }

  return new RefImpl(init)
}
