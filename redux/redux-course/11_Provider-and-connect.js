// 开发一个 React 应用和服务器来让浏览器可以访问
import webpackDevServer from './11_src/src/webpack-dev-server'
// 我们应用启动的主要服务器请求都是来自这个文件。
import server from './11_src/src/server'

// 如果 5050 端口号已经被占用了，那么就修改下面的端口号。
// 如果端口号是 X，那么我们可以用 X 作为服务器的端口号，用 X+1 作为 webpack-dev-server 的端口号
const port = 5050

// 启动 webpack dev server...
webpackDevServer.listen(port)
// ... 还有主应用服务器。
server.listen(port)

console.log(`Server is listening on http://127.0.0.1:${port}`)

