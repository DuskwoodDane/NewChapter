
export function Vue(options = {}) {
  this.__init(options);
}

// 初始化所有配置
Vue.prototype.__init = function (options) {
  this.$options = options;
  this.$el = options.el;
  this.$data = options.data;
  this.$methods = options.methods;
  // 将data绑定到代理上
  proxy(this, this.$data);
  // 生成一个观察者
  observer(this.$data);
  // 生成一个编译器
  new Compiler(this)
}

function proxy(target, data) {
  Object.keys(data).forEach(key => {
    // 将data中的数据代理/劫持 Vue实例上
    Object.defineProperty(target, key, {
      enumerable: true, // 是否可枚举
      configurable: true, // 是否可通过delete删除
      get() {
        return data[key]
      },
      set(newVal) {
        if (newVal !== data[key]) {
          data[key] = newVal
        }
      }
    })
  })
}

// 创建一个观察者, 观察对象 => $data
function observer(data) {
  new Observer(data)
}

// 观察者类
class Observer {
  constructor(data) {
    // 创建实例时就观察该对象
    this.walk(data)
  }

  // 遍历当前对象中的所有属性，一个个收集起来
  walk(data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]));
    }
  }

  // 收集并观察data的每一个属性
  defineReactive(obj, key, value) {
    let that = this;

    // 递归 => 只要传入的value是object，则继续收集
    this.walk(value)

    // 为每个属性创建一个dep依赖
    let dep = new Dep();
    // 劫持每个属性
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.add(Dep.target);
        }
        return value;
      },
      set(newVal) {
        if (value !== newVal) {
          value = newVal;
          // 如果赋值的内容是引用类型，依然走一遍递归的逻辑
          that.walk(newVal);
          // 视图更新
          dep.notify()
        }
      }
    })
  }
}

// 用以监听某一个数据,并将更新函数cb保存到Dep中, 当触发数据的set时会直接相应的render函数 => 视图的改变会更新数据
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb; // 执行更新的render函数

    // target为随意命名，为了将Watcher的实例对象传出去

    // 每次需要监听一个视图上的值会生成一个新的Watcher    new Watcher(this.vm, key, val => node.textContent = val})
    Dep.target = this;
    // 触发get函数 => 将this传进去，在set时会执行update(render)函数
    this.__old = vm[key];
    Dep.target = null;
  }

  update() {
    let newVal = this.vm[this.key];
    if (this.__old !== newVal) this.cb(newVal)
  }
}

// 每一个数据，都有一个依赖
class Dep {
  constructor() {
    this.watchers = new Set();
  }

  // get时将修改方法存入watcher中
  add(watcher) {
    if (watcher && watcher.update) this.watchers.add(watcher);
  }

  // 执行修改方法
  notify() {
    this.watchers.forEach(item => item.update())
  }
}

// 编译器
class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.methods = vm.$methods;

    this.compile(vm.$el)
  }

  // 编译
  compile(el) {
    let childNodes = el.childNodes;
    // 遍历所有节点
    Array.from(childNodes).forEach(node => {
      if (node.nodeType === 3) {       // 文本节点
        this.compileText(node)
      } else if (node.nodeType === 1) { // 元素节点
        this.compileElement(node)
      }

      // 递归嵌套在元素内的子节点
      if (node.childNodes && node.childNodes.length) this.compile(node);
    })
  }

  compileText(node) {
    const reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim(); // 取得上一个用以匹配正则的值
      node.textContent = value.replace(reg, this.vm[key]);
      new Watcher(this.vm, key, val => {
        node.textContent = val;
      })
    }
  }

  // 遍历元素节点
  compileElement(node) {
    if (node.attributes.length) {
      Array.from(node.attributes).forEach(attr => {
        let attrName = attr.name;
        if (attrName.startsWith('v-')) {
          // v-匹配  v-on:click => click 移除v-on: 取click  v-model 则移除v-
          attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2);
          let key = attr.value // 获取绑定的值 message => v-model="message"
          this.update(node, key, attrName, this.vm[key])
        }
      })
    }
  }

  /**
   * 根据不同指令执行不同操作
   * @param {*} node el
   * @param {*} key data中的key
   * @param {*} attrName 指令名称 => mode | click
   * @param {*} value vm中的value
   */
  update(node, key, attrName, value) {
    // v-model
    if (attrName === 'model') {
      // 初始化时将值赋予dom元素
      node.value = value;
      // 属性发生变化时更新dom
      new Watcher(this.vm, key, val => node.val = val);
      // 监听input value变化，更新数据
      node.addEventListener('input', () => {
        this.vm[key] = node.value;
      })
    } else if (attrName === 'click') { // v-on:click
      node.addEventListener(attrName, this.methods[key].bind(this.vm));
    }
  }
}


