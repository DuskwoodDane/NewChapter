
# Object.create(null) 和 {}的区别
```js
// 不需要引用Object原型上的任何属性方法，生成一个全新的object
Object.create(null).__proto__ // undefined
({}).__proto__ // Object.prototype
```