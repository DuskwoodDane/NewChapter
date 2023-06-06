

const module1 = {
  data: 'dane',
  foo() {
    console.log(`foo ${this.data}`)
  },
  bar() {
    console.log(`bar ${this.data}`)
  }
}


module1.data = 'test' // 能直接修改模块内部的数据
console.log('module1', module1) // 会暴露所有模块成员