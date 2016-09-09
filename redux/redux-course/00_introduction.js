// flux 的单向数据流图:

/*
                 _________               ____________               ___________
                |         |             |            |             |           |
                | Action  |------------▶| Dispatcher |------------▶| callbacks |
                |_________|             |____________|             |___________|
                     ▲                                                   |
                     |                                                   |
                     |                                                   |
 _________       ____|_____                                          ____▼____
|         |◀----|  Action  |                                        |         |
| Web API |     | Creators |                                        |  Store  |
|_________|----▶|__________|                                        |_________|
                     ▲                                                   |
                     |                                                   |
                 ____|________           ____________                ____▼____
                |   User       |         |   React   |              | Change  |
                | interactions |◀--------|   Views   |◀-------------| events  |
                |______________|         |___________|              |_________|

*/

// 假设我们正在构建一个网站应用，那么这个网站应用会由什么组成呢？
// 1) 模板/HTML = View
// 2) 填充视图的数据 = Model
// 3) 获取数据、将所有视图组装在一起、响应用户事件、
//    数据操作等等的逻辑 = Controller

// 这是我们熟知的非常典型的 MVC，但它和 flux 的概念其实是很像的，
// 只是在某些表述上有些小小的不同：
// - Model 看起来像 Store
// - 用户事件、数据操作以及它们的处理程序看起来像
//   "action creators" -> action -> dispatcher -> callback
// - View 看起来像 React view (或者其它类似的概念)

// 举一个例子，获取数据是一个 action，一个点击是一个 action，
// 一个 input 变化也是一个 action 等等。我们都已经习惯了从我们的应用里分发 action，
// 只是以不同的方式称呼它们。 不同于直接修改 Model 和 View，
// Flux 确保所有 action 首先通过一个 dispatcher，
// 然后再是 store，最后通知所有的 store 监听器。

// 为了弄清楚 MVC 和 flux 的不同，
// 我们举一个典型的 MVC 应用的用例：
// 一个典型的 MVC 应用的流程大致上是这样的：
// 1) 用户点击按钮 A
// 2) 点击按钮 A 的处理程序触发 Model A 的改变
// 3) Model A 的改变处理程序触发 Model B 的改变
// 4) Model B 的改变处理程序触发 View B 的改变并重新渲染自身

// 在这样的一个环境里，当应用出错的时候快速地定位 bug 来源是一件非常困难的事情。
// 这是因为每个 View 可以监视任何的 Model，
// 并且每个 Model 可以监视其它所有 Model，所以数据会从四面八方涌来，并且被许多源（view 或者 model）改变。

// 当我们用 flux 以及它的单向数据流的时候，上面的例子就会变成这样子：
// 1) 用户点击按钮 A
// 2) 点击按钮A的处理程序会触发一个被分发的 action，并改变 Store A
// 3) 因为其它的 Store 也被这个 action 通知了，所以 Store B 也会对相同的 action 做出反应
// 4) View B 因为 Store A 和 Store B 的改变而收到通知，并重新渲染

// 来看一下我们是如何避免 Store A 和 Store B 直接相关联的。
// Store 只能被 action 修改，别无他选。
// 并且当所有 Store 响应了 action 后，View 才会最终更新。由此可见，数据总是沿着一个方向进行流动：
//     action -> store -> view -> action -> store -> view -> action -> ...

