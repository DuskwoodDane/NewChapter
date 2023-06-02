
// self | this 代表子线程自身, 即子线程的全局对象
this.addEventListener('message', (e) => { // Web Worker 的执行上下文名称是 self，无法调用主线程的 window 对象的
  console.log('wokerEvent', self, e);
  postMessage(`worker线程接收到的消息：：：${e.data}`)
})