想让搜索引擎抓取到你的站点，服务端渲染这一步不可或缺，服务端渲染还可以提升站点的性能，因为在加载JavaScript脚本的同时，浏览器就可以进行页面渲染。
React的虚拟DOM是其可被用于服务端渲染的关键。首先每个ReactComponent 在虚拟DOM中完成渲染，然后React通过虚拟DOM来更新浏览器DOM中产生变化的那一部分，
虚拟DOM作为内存中的DOM表现，为React在Node.js这类非浏览器环境下的吮吸给你提供了可能，React可以从虚拟DoM中生成一个字符串。而不是跟新真正的DOM，这使得我们可以在客户端和服务端使用同一个React Component。
 
React 提供了两个可用于服务端渲染组件的函数：React.renderToString 和React.render-ToStaticMarkup。 在设计用于服务端渲染的ReactComponent时需要有预见性，考虑以下方面。
	选取最优的渲染函数。
	如何支持组件的异步状态。
	如何将应用的初始化状态传递到客户端。
	哪些生命周期函数可以用于服务端的渲染。
	如何为应用提供同构路由支持。
	单例、实例以及上下文的用法。

一、渲染函数
在服务端渲染React Component时，无法使用标准的React.render方法，因为服务端不存在DOM。React提供了两个渲染的函数，它们支持标准的React Component生命周期的一个子集。因而能够实现服务端渲染。

React.renderToString是两个服务端渲染函数中的一个，也是开发主要使用的一个函数，和React.render不同，该函数去掉了用于表示渲染位置的参数。取而代之，该函数只返回一个字符串，这是一个快速的同步（阻塞式）函数，非常快。
var MyComponent = React.createClass({
render:fucniton(){
return <div> Hello World!</div>;
}
});
var world= React.renderToString (<MyComponent/>);

//这个示例返回一个单行并且格式化的输出
<divdata-reactid=".fgvrzhg2yo"data-ract-checksum="-1663559667">
Hello World!
</div>

你会注意到，React为这个<div>元素添加了两个data前缀的属性。在浏览器环境下，React使用data-reactid区分DOM节点。这也是每当组件的state及props发生变化时，React都可以精准的跟新制定DOM节点的原因。

data-react-checksum仅仅存在于服务端。顾名思义，它是已创建DOM和校验和。这准许React在客户端服用与服务端结构上相同点的DOM结构。该属性只会添加到跟元素上。

二、React.renderToStaticMarkup
React.renderToStaticMarkup是第二个服务端渲染函数，除了不会包含React的data属性外，它和React.renderToString没有区别。
varMyComponent=React.createClass({
render：function（）{
return<div>Hello World!</div>;
}
});
varworld= React.renderToStaticMarkup(<MyCompoent/>);

//单行输出
<div>HelloWorld!</div>

三、用React.renderToString还是React.renderToStaticMarkup
每个渲染函数都有自己的用途，所以你必须明确自己的需求，再去决定使用哪个渲染函数。当且仅当你不打算在客户端渲染这个React Component时，才应该选择使用React.renderToStaticMarkup函数。

大多数情况下，我们都会选择使用React.renderToString.这将准许React使用data-react-checksum在客户端跟迅速的初始化同一个React Component因为React可以重用服务端提供的
DOM，所以它可以跳过生成DOM节点以及把他们挂载到文档中这两个昂贵的进程，对于复杂些的站点，这样做就会显著的减少加载时间，用户可以更快的与站点进行交互。
确保React Component能够在服务端和客户端准确的渲染出一致的结构是很重要的。如果data-react-checksum不匹配，React会舍弃服务端提供的DOM，然后生成新的DOM节点，并且将它们更新到文档中。


四、服务端组件生命周期
一旦渲染为字符串，组件就会值调用位于render之前的组件生命周期方法，需要指出，componentDidMount和componentWillUnmount不会在服务端渲染过程中被调用，而domponentWillMount在两种渲染方式下均有效。
当新建一个组件时，你需要考虑到它可能即在服务端又在客户端进行渲染。这一点在创建事件监听器时有位重要，应为并不存在一个生命周期方法会通知我们React Component是否已将走完了整个生命周期。
在componentWillMount内注册的所有事件监听器及定时器都可能潜在的导致服务端内存泄漏。
最佳做法是只在componentDidMount内部创建事件监听器及定时器，然后再componentWilUnmount内清除这两者。



五、设计组件
服务端渲染时，请务必慎重考虑如何将组件的state传递到客户端，以充分利用服务端渲染的优势。再设计服务端渲染组件时，要时刻记得这一点。在设计React Component时，需要保证同一个props传递到组件中，总会输出相同的初始渲染结果。坚持这样做将会提升组件的可测试性，并且可以保证组件在服务端和客户端渲染结果的一致性。充分利用服务端渲染的性能优势十分重要。
我们假设现在需要一个组件，它可以打印一个随机数。一个棘手问题是组件每次输出的结果总是不一致。如果组件在服务端而不是客户端进行渲染，checksum将会失效。
var MyComponent =React.createClass({
render:dunction(){
return <div>{Math.random()}</div>;
}
});
var result = React.renderToStaticmarkup(<MyComponent/>);
varresult2=REact.renderToStaticMarkup(<MyComponent/>);
 
//result
<div>0.5820949131157249</div>
 
//result2
<div>0.420401582631672</div>
如果你打算重构它，组件将会通过props来接收一个随机数，然后，将props传递到客户端用于渲染。
 
var MyComponent= React.createClass({
render :function(){
     retrun<div>{this.props.number}</div>
}
});
 
var num=Math.random();
//服务端
React.renderToString(<MyComponentnumber={num}/);
 
//将num传递到客户端
React.render(<MyComponentnumber ={num}/>,document.body);
 
有多种方式可以讲服务端的props传递到客户端。
最简单的方式之一是通过JavaScript对象将初始的props值传递到客户端。
<!DOCTYPEhtml>
<html>
<head>
<title>Example</title>
<!--bundle 包括MyComponent、React等-->
<script type ="text/javascript" src="bundle.js"></script>
</head>
 
<body>
<!--服务端渲染MyComponent的结果-->
<div data-reactid=".fgvrzhg2yo"data-react-checksum="-1663559667">
0.5820949131157249
</div>
 
<!--注入初始props，供服务端使用-->
<script type="text/javascript">
var initialProps ={"num":0.5820949131157249};
</script>
 
<!--使用服务端初始props-->
<script type-"text/javasript">
var num=initialProps.num;
React.render(<MyComponent number={num}/>,document.body);
</script>
</body>
</html>






























