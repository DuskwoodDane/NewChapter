


/**
 * 分段1 => resolve和reject
 * 1. 执行了resole, Promise状态会变成fulfilled
 * 2. 执行了reject, Promise状态会变成rejected
 * 3. Promise状态不可逆, 第一次成功就永久为falfilled, 第一次失败就永远状态为rejected
 * 4. Promise中有throw的话
 */

// let p1 = new Promise((resolve, reject) => {
//   resolve('success')
//   reject('fail')
// })
// console.log('p1', p1)

// let p2 = new Promise((resolve, reject) => {
//   reject('fail')
//   resolve('success')
// })
// console.log('p2', p2)

// let p3 = new Promise((resolve, reject) => {
//   throw('error')
// })
// console.log('p3', p3)

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
  }

  resolve(value) {
    // state是不可变的
    if (this.promiseState !== 'pending') return;
    // 如果执行resolve, 状态变为fulfilled
    this.promiseState = 'fulfilled';
    this.promiseResult = value;
  }

  reject(value) {
    // state是不可变的
    if (this.promiseState !== 'pending') return;
    // 如果执行reject，状态变为rejected
    this.promiseState = 'rejected';
    this.promiseResult = value;
  }
}

const p1 = new MyPromise((resolve, reject) => {
  resolve('success');
  reject('fail');
})

const p2 = new MyPromise((resolve, reject) => {
  reject('fail');
  resolve()
})

console.log(p1)



