
let deps = null;

const handler = () => {
  let reactions = []
  return {
    get(target, key, descriptor) {
      if (deps) {
        reactions.push(deps)
      }
      return Reflect.get(target, key, descriptor)
    },
    set(target, key, value, descriptor) {
      const res = Reflect.set(target, key, value, descriptor)
      reactions.forEach(item => item())
      return res
    }
  }
}

const walk = (data, handler) => {
  if (typeof data !== 'object') return data
  for (let key in data) {
    // 递归绑定代理，将每个对象都通过proxy的handle绑定相应的set、get。如果是非对象，就直接将结果赋值给data
    data[key] = walk(data[key], handler())
  }

  // 如果data传入的是对象，最终walk返回的是一个代理后的对象
  return new Proxy(data, handler())
}

const track = (data) => {
  return walk(data, handler)
}

const effect = (fn) => {
  deps = fn
  fn()
  deps = null
}

const initData = { count: 0 }

const data = track(initData)

/**
 * effect里的函数其实只在初始化的时候执行了一遍，在首次赋值的时候传递给了dep，
 * 并在函数中触发了get操作，执行了data的get方法，将函数保存到了reactions，在set时会重新执行
 */
effect(() => {
  console.log(data.count)
})

// 后续再次触发proxy的get时，因为deps是null，所以没有执行reactions的添加操作
console.log('222', data.count)
data.count = 1
data.count = 2
