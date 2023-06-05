# 提要
```txt
  标记*号的为重点，面试前要多加复习。
  参考链接：https://juejin.cn/post/6905294475539513352#heading-2

  本地启动node服务器 => 终端进入目标文件夹，然后在终端输入 http-server
   http-server -c-1 （只输入http-server的话，更新了代码后，页面不会同步更新）

```

# 1. src和href的区别 *
```txt
  src：表示对资源的引用，它指向的内容会被嵌入到当前标签所在的位置。src会将其指向的资源下载并运用到文档内，如请求
  js脚本，当浏览器解析到该元素时，会暂停其他资源的下载和处理，直接将该资源加载、编译、执行。所以js脚本一般都会
  放在页面底部。
  href: 表示超文本引用，它指向一些网络资源，使其与当前文档建立链接关系，当浏览器识别到它指向的文件时，就会并行下载资源，不会停止对当前
  文档的处理。常用在a、link等标签上。
```

# 2. 语义化的理解 *
```txt
  优点：
    (1) 对机器友好, 更适合搜索引擎的爬虫爬取有效信息，有利于SEO。
    (2) 对开发者友好，使用语义化标签增强了可读性。结构更加清晰，便于团队的开发与维护。
```
```html
  常见的语义化标签 * => 开始使用
  <header>头部</header>
  <nav>导航栏</nav>
  <section>区块(有语义化的div)<section>
  <main>主要区域<main>
  <article>主要内容</article>
  <aside>侧边栏</aside>
  <footer>底部</footer>
```

# 3. DOCTYPE(文档类型的作用)
```txt
  DOCTYPE是HTML5中一种标准用标记语言的文档类型声明，它的目的是告诉浏览器(解析器)应该以什么样(html/xhtml)的文档类型来定义和解析文档，不同的渲染方式会影响浏览器对CSS及JS的解析。它必须声明在文档的第一行。

  渲染页面的两种模式：
    1. CSS1Compat: 标准模式，默认模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
    2. BackCompat: 怪异模式，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松向后兼容的方式显示。

  带来的影响：
    1. 在怪异模式(IE盒模型)下，元素的width和height除了内容区域，还包含了padding和border的值。而标准模式(标准盒模型)不会计入这两个，只会将元素的宽高计为内容区域的大小。
    2. 图片的垂直对齐方式
    对于inline和table-cell的元素来说，
    标准模式下vertical-align属性的默认值为baseline；
    怪异模式下vertical-align属性的默认值为bottom。
    3. 元素的溢出处理
    标准模式下overflow的默认值为visible；
    怪异模式下元素溢出的内容不会被裁减，元素的大小由其内容决定，自动调整。
    4. 内联元素的尺寸
    标准模式下inline元素是无法自定义设置宽高的，而在怪异模式下width和height是可以影响其大小的。
    5. table元素中的字体
    CSS中，对于font的属性都是可以继承的，但是在怪异模式下，对于table元素，字体的某些属性将不会从body等其他元素中继承得到，特别是font-size属性。
```

# 4. script标签中defer和async的区别 *
```txt
  script：
    普通的script会阻塞dom及其他脚本的加载与执行，浏览器必须等待当前script执行完成才会接着往下走。
    defer与async都是去异步加载外部的js文件，它们都不会阻塞页面的解析。
  defer：
    先异步下载，并且会在dom构建好后执行。多个defer脚本时，会保持相对顺序依次执行，哪怕后面的脚本先下载完成，所以defer可用于对脚本执行顺序有严格要求的情况。
  async：
    async在后台下载好后会立即执行，不会等待其他脚本
```

# 5. 常用的meta标签有哪些 *
```txt
  meta标签由name和content属性定义，用来描述网页文档的属性。除了HTTP标准固定了一些name作为大家使用的共识，开发者还可以自定义name。
```
```html
  <!-- charset, 用来描述HTML文档的编码格式 -->
  <meta charset="UTF-8">
  <!--  keywords 页面关键字-->
  <meta name="keywords" content="游戏">
  <!-- description 页面描述 -->
  <meta name="description" content="页面描述内容">
  <!-- refresh，页面重定向和刷新 -->
  <meta http-equiv="refresh" content="0;url=" />
  <!--  viewport 适配移动端，可以控制视口的大小和比例-->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    参数如下：
      width: 宽度(数值/device-width)
      height: 高度(数值/device-height)
      initial-scale：初始缩放比例
      maximum-scale： 最大缩放比例
      minimum-scale： 最小缩放比例
      user-scalable： 是否允许用户缩放(yes/no)
  <!--  搜索引擎索引方式 -->
  <meta name="robots" content="index,follow" />
    参数如下：
      all：文件将被检索，且页面上的链接可以被查询；
      none：文件将不被检索，且页面上的链接不可以被查询；
      index：文件将被检索；
      follow：页面上的链接可以被查询；
      noindex：文件将不被检索；
      nofollow：页面上的链接不可以被查询。
```

# 6. HTML5有哪些更新 *
```txt
（1）新增语义化标签：nav、header、footer、aside、section、article
（2）音频、视频标签：audio、video
（3）数据存储：localStorage、sessionStorage
（4）canvas（画布）、Geolocation（地理定位）、websocket（通信协议）
（5）input标签新增属性：placeholder、autocomplete、autofocus、required
（6）history API：go、forward、back、pushstate
```

# 7. Web worker *
```txt
  参考链接：https://juejin.cn/post/7176788060619669565
  相关demo可参考webwork目录
  常规使用 index.html => worker.js
  使用场景 => 处理大量CPU耗时计算操作 => calc.html => calc-worker.js

  概述：Web Worker的作用, 就是为javascript创造多线程环境，[允许主线程创建Worker线程，将一些任务分配给后者运行]。这样的好处是，一些计算密集型或高延迟的任务，被Worker线程负担了，主流程
  就会很流畅，不会被阻塞或拖慢.

  使用限制：
    (1) 同源限制：  分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
    (2) 文件限制：  Worker 线程无法读取本地文件（file://），会拒绝使用 file 协议来创建 Worker实例，它所加载的脚本，必须来自网络。
    (3) DOM操作限制： Worker 线程所在的全局对象，与主线程不一样.无法读取主线程所在网页的 DOM 对象, 无法使用document、window、parent这些对象.
    (4) 通信限制： Worder线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成，交互的方法分别是postMessage和onMessage, 并且在数据传递的时候，Worker是使用拷贝的方式。
    (5) 脚本限制：Worker 线程不能执行alert()和confirm()，但可以使用ajax请求,setTimeout、setInterval等API.
```

```js
  const worker = new Worker(aURL, options);
  // worker.postMessage: 向 worker 的内部作用域发送一个消息，消息可由任何 JavaScript 对象组成
  // worker.terminate: 立即终止 worker。该方法并不会等待 worker 去完成它剩余的操作；worker 将会被立刻停止
  // worker.onmessage:当 worker 的父级接收到来自其 worker 的消息时，会在 Worker 对象上触发 message 事件
  // worker.onerror: 当 worker 出现运行中错误时，它的 onerror 事件处理函数会被调用。它会收到一个扩展了 ErrorEvent 接口的名为 error 的事件
```

```txt
  Web Worker 的执行上下文名称是 self | this，无法调用主线程的 window 对象的。
  Worker线程内部要加载其他脚本，可以使用 importScripts()
```
```js
  importScripts("constants.js");
  // self 代表子线程自身，即子线程的全局对象
  self.addEventListener("message", function (e) {
    self.postMessage(foo); // 可拿到 `foo`、`getAge()`、`getName`的结果值 
  });

  // constants.js
  const foo = "变量";
 
  function getAge() {
    return 25;
  }

  const getName = () => {
    return "jacky";
  };

  // 还可以同时加载多个脚本 
  importScripts('script1.js', 'script2.js');
```
```txt
  内嵌worker： 除了通过引入js文件的方式，还可以通过window.URL.createObjectURL()创建URL对象，创建内嵌的worker.
```

```html
  <!--  这段代码不会被 JS 引擎直接解析，因为类型是 'javascript/worker' -->
  <script id="worker" type="javascript/worker">
    this.addEventListener('message', (e) => { // Web Worker 的执行上下文名称是 self，无法调用主线程的 window 对象的
      console.log('wokerEvent', self, e);
      postMessage(`Blob worker线程接收到的消息：：：${e.data}`)
    })
  </script>
  <script>
      const blobWorkerScript = document.querySelector('#worker').textContent
      const blob = new Blob([blobWorkerScript], { type: 'text/javascript' })
      const worker = new Worker(window.URL.createObjectURL(blob))
  </script>
```
