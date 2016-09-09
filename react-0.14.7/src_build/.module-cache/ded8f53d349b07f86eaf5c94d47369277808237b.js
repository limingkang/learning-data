// 标签嵌套js的语法就是所谓的jsx

// React.render(
//     <h1>Hello, wofdlg!</h1>,
//     document.getElementById('example')
// );

// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('example')
// );

// var names = ['Alice', 'Emily', 'Kate'];
// ReactDOM.render(
//   <div>
//   {
//     names.map(function (name) {
//       return <div>Hello, {name}!</div>
//     })
//   }
//   </div>,
//   document.getElementById('example')
// );




// // this.props 对象的属性与组件的属性一一对应，但是有一个例外，就是 this.props.children 属性。它表示组件的所有子节点
// var NotesList = React.createClass({
//   render: function() {
//     return (
//       <ol>
//       {
//         React.Children.map(this.props.children, function (child) {
//           return <li>{child}</li>;
//         })
//       }
//       </ol>
//     );
//   }
// });

// ReactDOM.render(
//   <NotesList>
//     <span>hello</span>
//     <span>world</span>
//   </NotesList>,
//   document.getElementById('example')
// );




// // 组件类的PropTypes属性，就是用来验证组件实例的属性是否符合要求
// var MyTitle = React.createClass({
//   propTypes: {
//     title: React.PropTypes.string.isRequired,
//   },
//   // 设置默认值，在你不写title或者title没有赋值的时候就会显示这个值
//   getDefaultProps : function () {
//       return {
//         title : 'Hello World'
//       };
//   },

//   render: function() {
//      return <h1> {this.props.title} </h1>;
//    }
// });
// // 上面的Mytitle组件有一个title属性。PropTypes 告诉 React，这个 title 属性是必须的，而且它的值必须是字符串。
// // 若设置 title 属性的值是一个数值就会报错,但是还是会渲染出来的
// var data = "456785";
// ReactDOM.render(
//   <MyTitle title={data} />,
//   document.getElementById('example')
// );





// // 组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。
// // 只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，
// // 然后再将实际发生变动的部分，反映在真实 DOM上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。
// var MyComponent = React.createClass({
//   handleClick: function() {
//     this.refs.myTextInput.focus();
//   },
//   render: function() {
//     return (
//       <div>
//         <input type="text" ref="myTextInput" />
//         <input type="button" value="Focus the text input" onClick={this.handleClick} />
//       </div>
//     );
//   }
// });

// ReactDOM.render(
//   <MyComponent />,
//   document.getElementById('example')
// );
// // 上面代码中，组件 MyComponent 的子节点有一个文本输入框，用于获取用户的输入。这时就必须获取真实的 DOM 节点，
// // 虚拟 DOM 是拿不到用户输入的。为了做到这一点，文本输入框必须有一个 ref 属性，
// // 然后 this.refs.[refName] 就会返回这个真实的 DOM 节点。
// // 需要注意的是，由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，
// // 才能使用这个属性，否则会报错。上面代码中，通过为组件指定 Click 事件的回调函数，
// // 确保了只有等到真实 DOM 发生 Click 事件之后，才会读取 this.refs.[refName] 属性。






// // this.setState 方法就修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件
// // 由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，
// // this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性
// var LikeButton = React.createClass({
//   getInitialState: function() {
//     return {liked: false};
//   },
//   handleClick: function(event) {
//     this.setState({liked: !this.state.liked});
//   },
//   render: function() {
//     var text = this.state.liked ? 'like' : 'haven\'t liked';
//     return (
//       <p onClick={this.handleClick}>
//         You {text} this. Click to toggle.
//       </p>
//     );
//   }
// });

// ReactDOM.render(
//   <LikeButton />,
//   document.getElementById('example')
// );




// // 上面代码中，文本输入框的值，不能用 this.props.value 读取，而要定义一个 onChange 事件的回调函数，
// // 通过 event.target.value 读取用户输入的值。textarea 元素、select元素、radio元素都属于这种情况
// var Input = React.createClass({
//   getInitialState: function() {
//     return {value: 'Hello!'};
//   },
//   handleChange: function(event) {
//     this.setState({value: event.target.value});
//   },
//   render: function () {
//     var value = this.state.value;
//     return (
//       <div>
//         <input type="text" value={value} onChange={this.handleChange} />
//         <p>{value}</p>
//       </div>
//     );
//   }
// });

// ReactDOM.render(<Input/>, document.getElementById('example'));





// // 组件的style应该写成style={{opacity: this.state.opacity}}
// //第一重大括号表示这是 JavaScript 语法，第二重大括号表示样式对象
// var Hello = React.createClass({
//   getInitialState: function () {
//     return {
//       opacity: 1.0
//     };
//   },

//   componentDidMount: function () {
//     this.timer = setInterval(function () {
//       var opacity = this.state.opacity;
//       opacity -= .05;
//       if (opacity < 0.1) {
//         opacity = 1.0;
//       }
//       this.setState({
//         opacity: opacity
//       });
//     }.bind(this), 100);
//   },

//   render: function () {
//     return (
//       <div style={{opacity: this.state.opacity}}>    
//         Hello {this.props.name}
//       </div>
//     );
//   }
// });

// ReactDOM.render(
//   <Hello name="world"/>,
//   document.getElementById('example')
// );





// 组件的数据来源，通常是通过 Ajax 请求从服务器获取，可以使用 componentDidMount 方法设置 Ajax 请求，
// 等到请求成功，再用 this.setState 方法重新渲染 UI
var UserGist = React.createClass({displayName: "UserGist",
  getInitialState: function() {
    return {
      username: '',
      lastGistUrl: ''
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var lastGist = result[0];
      if (this.isMounted()) {
        this.setState({
          username: lastGist.owner.login,
          lastGistUrl: lastGist.html_url
        });
      }
    }.bind(this));
  },

  render: function() {
    return (
      React.createElement("div", null, 
        this.state.username, "'s last gist is", 
        React.createElement("a", {href: this.state.lastGistUrl}, "here"), "."
      )
    );
  }
});

ReactDOM.render(
  React.createElement(UserGist, {source: "https://api.github.com/users/octocat/gists"}),
  document.body
);














