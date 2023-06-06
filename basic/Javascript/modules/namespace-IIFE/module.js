// module.js
(function (window) {
  let data = 'dane'
  let num = 10

  function getData() {
    return data;
  }

  function private() {
    console.log('我是内部的函数, 不对外')
  }

  function bar() {
    private();
  }

  function add(value) {
    return value + num
  }

  window.myModule = { getData, bar, add }
})(window)