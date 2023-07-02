
export class Vue {
  constructor(options) {
    this.__init(options);
  }

  __init(options) {
    this.$options = options;
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods;

    proxy(this, this.$data);

    observer(this.$data);

    new Compiler(this)
  }
}

function proxy(target, data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
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

function observer(data) {
  new Observer(data)
}

class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
    }
  }

  defineReactive(obj, key, value) {
    let that = this;

    this.walk(value);

    let dep = new Dep()

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.add(Dep.target);
        }
        return value
      },
      set(newVal) {
        if (value !== newVal) {
          value = newVal;
          that.walk(newVal);
          dep.notify()
        }
      }
    })
  }
}

// 
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    Dep.target = this;
    this.__old = vm[key];
    Dep.target = null;
  }

  update() {
    const newVal = this.vm[this.key];
    if (this.__old !== newVal) this.cb(newVal);
  }
}

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

class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.methods = vm.$methods;
    this.compile(vm.$el);
  }

  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (node.nodeType === 3) {
        this.compileText(node);
      } else if (node.nodeType === 1) {
        this.compileElement(node)
      }

      if (node.childNodes && node.childNodes.length) this.compile(node)
    })
  }

  compileText(node) {
    const reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);
      new Watcher(this.vm, key, val => {
        node.textContent = val
      })
    }
  }

  compileElement(node) {
    if (node.attributes.length) {
      Array.from(node.attributes).forEach(attr => {
        let attrName = attr.name;
        if (attrName.startsWith('v-')) {
          attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2);
          let key = attr.value;
          this.update(node, key, attrName, this.vm[key])
        }
      })
    }
  }

  update(node, key, attrName, value) {
    if (attrName === 'model') {
      node.value = value;
      new Watcher(this.vm, key, val => node.val = val);
      node.addEventListener('input', () => {
        this.vm[key] = node.value
      })
    } else if (attrName === 'click') {
      node.addEventListener(attrName, this.methods[key].bind(this.vm))
    }
  }
}

