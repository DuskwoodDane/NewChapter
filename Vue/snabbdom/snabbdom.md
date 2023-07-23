# snabbdom

## 参考文档
[虚拟dom参考-snabbdom](https://github.com/snabbdom/snabbdom)
[snabbdom中文文档](https://github.com/snabbdom/snabbdom/blob/HEAD/README-zh_CN.md)
[参考链接](https://www.jianshu.com/p/fbdaec651aba)

## h函数的重载
* 参数个数或类型不同的函数
* javascript中没有重载的概念
* Typescript中有重载, 不过重载的实现还是通过代码调整参数

```ts

/**
 * src/is.ts 
 * 验证传入字符是否为字符串或数值类型 包括String()和Number()
 */
export function primitive(s: any): s is string | number {
  return (
    typeof s === "string" ||
    typeof s === "number" ||
    s instanceof String ||
    s instanceof Number
  );
}

/**
 * src/h.ts
 */
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData | null): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(
  sel: string,
  data: VNodeData | null,
  children: VNodeChildren
): VNode;
export function h(sel: any, b?: any, c?: any): VNode {
  let data: VNodeData = {};
  let children: any;
  let text: any;
  let i: number;
  // 处理参数, 实现重载的机制 => 处理第三个参数
  if (c !== undefined) {
    // b = data => 处理data
    if (b !== null) {
      data = b;
    }
    // c = children => 验证c是否为数组
    if (is.array(c)) {
      children = c;
    } else if (is.primitive(c)) { // 验证c是否为字符串或数值
      text = c.toString(); // 将其转为字符串并渲染为文本节点
    } else if (c && c.sel) { // 验证c是否为一个父节点
      children = [c];
    }
  } else if (b !== undefined && b !== null) { // 第二个参数
    if (is.array(b)) {  
      children = b;
    } else if (is.primitive(b)) {
      text = b.toString();
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) // 遍历整个children
      // 将所有字符串和数值类型直接渲染成文本节点
        children[i] = vnode(
          undefined,
          undefined,
          undefined,
          children[i],
          undefined
        );
    }
  }
  if (
    sel[0] === "s" &&
    sel[1] === "v" &&
    sel[2] === "g" &&
    (sel.length === 3 || sel[3] === "." || sel[3] === "#")
  ) {
    addNS(data, children, sel);
  }
  return vnode(sel, data, children, text, undefined);
}
```

## VNode
一个VNode就是一个虚拟节点用来描述一个DOM元素, 如果这个VNode有children就是Virtual Dom

```ts
export interface VNode {
  sel: string | undefined; // 选择器
  data: VNodeData | undefined; // 节点数据: 属性 | 样式 | 事件等
  children: Array<VNode | string> | undefined; // 子节点
  elm: Node | undefined; // 记录vnode对应的真实dom
  text: string | undefined; // 文本节点
  key: Key | undefined; // 优化
}

export interface VNodeData {
  props?: Props;
  attrs?: Attrs;
  class?: Classes;
  style?: VNodeStyle;
  dataset?: Dataset;
  on?: On;
  attachData?: AttachData;
  hook?: Hooks;
  key?: Key;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: any[]; // for thunks
  is?: string; // for custom elements v1
  [key: string]: any; // for any other 3rd party module
}

export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | DocumentFragment | Text | undefined
): VNode {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}
```

## init && patch

```ts
const hooks: Array<keyof Module> = [
  "create",
  "update",
  "remove",
  "destroy",
  "pre",
  "post",
];

// TODO Should `domApi` be put into this in the next major version bump?
export type Options = {
  experimental?: {
    fragments?: boolean;
  };
};

/**
 * 初始化并返回patch函数(高阶函数)
 * 因为patch函数会调用多次, 通过高阶函数让init形成闭包，返回的patch()依然可以访问到外部的依赖，而不需要重新创建
 */
export function init(
  modules: Array<Partial<Module>>,
  domApi?: DOMAPI,
  options?: Options
) {
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };

  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;

  for (const hook of hooks) {
    for (const module of modules) {
      const currentHook = module[hook];
      if (currentHook !== undefined) {
        (cbs[hook] as any[]).push(currentHook);
      }
    }
  }

  function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
    // 对比唯一Key，dom 文本节点
  const isSameKey = vnode1.key === vnode2.key;
  const isSameIs = vnode1.data?.is === vnode2.data?.is;
  const isSameSel = vnode1.sel === vnode2.sel;
  // 如果非元素节点，判断文本节点
  const isSameTextOrFragment =
    !vnode1.sel && vnode1.sel === vnode2.sel
      ? typeof vnode1.text === typeof vnode2.text
      : true;

  return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
}
  // ...
  return function patch(
    oldVnode: VNode | Element | DocumentFragment,
    vnode: VNode
  ): VNode {
    let i: number, elm: Node, parent: Node;
    const insertedVnodeQueue: VNodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isElement(api, oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    } else if (isDocumentFragment(api, oldVnode)) {
      oldVnode = emptyDocumentFragmentAt(oldVnode);
    }

    // 比较新旧节点
    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      // 
      elm = oldVnode.elm!;
      parent = api.parentNode(elm) as Node;

      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vnode;
  };
}
```


