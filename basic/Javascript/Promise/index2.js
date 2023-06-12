


/**
 * 分段1 => resolve和reject
 * 1. 执行了resole, Promise状态会变成fulfilled
 * 2. 执行了reject, Promise状态会变成rejected
 * 3. Promise状态不可逆, 第一次成功就永久为falfilled, 第一次失败就永远状态为rejected
 * 4. Promise中有throw的话
 */

/**
 * 分段2 => then
 * 1. then接收两个回调, 一个是成功回调, 一个是失败回调
 * 2. 当Promise状态为fulfilled执行成功回调, 为rejected执行失败回调
 * 3. 如resolve或reject在定时器里, 则定时器结束后再执行then
 * 4. then支持链式调用, 下一次then执行受上一次then返回值的影响
 *    (1) then方法本身会返回一个新的Promise对象;
 *    (2) 如果返回值是promise对象，返回值为成功, 新promise就是成功;
 *    (3) 如果返回值是promise对象，返回值为失败, 新promise就是失败;
 *    (4) 如果返回值是非promise对象，新promise就是成功, 值为此返回值;
 */

class MyPromise {
  constructor(executor) {
    // 初始化值
    this.initValue()
    // 初始化this指向
    this.initBind()
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误及直接执行reject
      this.reject(e)
    }

  }

  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    this.promiseResult = null; // 最终值
    this.promiseState = 'pending'; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  resolve(value) {
    // state是不可变的
    if (this.promiseState !== 'pending') return;
    // 如果执行resolve, 状态变为fulfilled
    this.promiseState = 'fulfilled';
    this.promiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.promiseResult)
    }
  }

  reject(value) {
    // state是不可变的
    if (this.promiseState !== 'pending') return;
    // 如果执行reject，状态变为rejected
    this.promiseState = 'rejected';
    this.promiseResult = value;

    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift(this.promiseResult);
    }
  }

  // 接收两个回调onFulfilled onRejected
  then(onFulfilled, onRejected) {
    // 参数校验，确保一定是函数(如果为非函数, 则将其包装)
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    // 这里用const来声明thenPromsie，在验证x === thenPromise时会卡住，原因还未知
    var thenPromise = new MyPromise((resolve, reject) => {

      const resolvePromise = cb => {
        // 可在这儿添加一个setTimeout模拟宏任务
        try {
          var x = cb(this.promiseResult);
          /**
           * 不能返回自身
           * 每次调用then会生成一个新的MyPromise对象, 如果最终还是以该promise对象作为结果返回,
           * 则报错
           */
          if (x === thenPromise && x) {
            throw new Error('不能返回自身')
          }
          // 验证结果是否为Promise对象
          if (x instanceof MyPromise) {
            x.then(resolve, reject);
          } else {
            // 非Promise对象则直接成功，将该值作为结果传递过去
            resolve(x)
          }
        } catch (err) {
          // 处理报错
          reject(err)
          throw new Error(err)
        }
      }

      // 若为成功状态,执行第一个回调
      if (this.promiseState === 'fulfilled') {
        resolvePromise(onFulfilled)
      } else if (this.promiseState === 'rejected') {
        // 如果当前为失败状态，执行第二个回调
        resolvePromise(onRejected)
      } else if (this.promiseState === 'pending') {
        // 如果状态为待定状态, 暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    })

    return thenPromise
  }
}

// 分段2 - 1.1 test
const p1 = new MyPromise((resolve, reject) => {
  reject('eeeerrrr')
})

p1.then(res => console.log('res', res), err => console.log('err', err))

// 分段2 -1.2 test
const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success') // 3秒后输出success
  }, 3000)
})

p2.then(res => console.log(res), err => console.log(err));

// 分段3 -1.3 链式调用

// then返回promise
const p3_1 = new MyPromise((resolve, reject) => {
  resolve(10)
}).then(res => {
  return new MyPromise((resolve, reject) => {
    resolve(res * 10)
  })
}).then(res => {
  console.log('last==', res) // 200
})

// then返回非promise
const p3_2 = new MyPromise((resolve, reject) => {
  resolve(10)
}).then(res => {
  return res * 2
}).then(res => {
  console.log('last222==', res) // 20
})

// then返回自身
const p3_3 = new MyPromise((resolve, reject) => {
  resolve(10)
}).then(res => {
  return p3_3
}).then(res => {
  console.log('last222==', res) 
}, e => console.log('error', e)) // 执行error






