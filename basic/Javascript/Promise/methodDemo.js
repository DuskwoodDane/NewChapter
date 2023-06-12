const p1 = new Promise((resolve, reject) => {
  resolve('success')
})

const p2 = new Promise((resolve, reject) => {
  reject('fail')
})

const p3 = 100

/**
 * ? all
 * 1. 接收一个Promise数组, 数组中如有非Promise项, 则此项当做成功
 * 2. 如果所有Promise都成功, 则返回成功结果数组
 * 3. 如果有一个Promise失败, 则返回这个失败结果
 */
// Promise.all([p1, p3]).then((res) => {
//   console.log('res==', res)
// }).catch(e => console.log(e))


/**
 * ? race
 * 1. 接收一个Promise数组, 数组中如有非Promise项, 则此项当做成功;
 * 2. 哪个Promise最快得到结果, 就返回哪个结果, 无论成功失败
 */
// Promise.race([p1, p2, p3]).then((res) => console.log(res)).catch(e => console.log(e))

Promise.allSettled([p1, p2, p3]).then((res) => console.log(res)).catch(e => console.log(e))
