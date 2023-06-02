

function calc(num) {
  let result = 0
  // 从那以后经过的时间，以毫秒返回
  let startTime = performance.now()
  console.log('pf==', performance)
  for (let i = 0; i <= num; i++) {
    result += i
  }
  // 由于是同步计算，在没计算完成之前下面的代码都无法执行
  const time = performance.now() - startTime
  console.log('总计算花费时间--tt:', time)
  // document.getElementById('result').innerHTML = result
  self.postMessage(result)
}

self.onmessage = (e) => {
  calc(e.data)
}