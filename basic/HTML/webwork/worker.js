
// self 代表子线程自身, 即子线程的全局对象
self.addEventListener('message', (e) => {
  console.log('wokerEvent', e);
  self.postMessage('worker线程接收到的消息：：：', e.data)
})