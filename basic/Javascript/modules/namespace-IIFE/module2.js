
// module2.js
(function (window, myModule) {
  function computed(value) {
    return myModule.add(value)
  }

  window.myModule2 = { computed }
})(window, myModule)
