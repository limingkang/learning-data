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





// 组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。
// 只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，
// 然后再将实际发生变动的部分，反映在真实 DOM上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。
var MyComponent = React.createClass({displayName: "MyComponent",
  handleClick: function() {
    this.refs.myTextInput.focus();
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("input", {type: "text", ref: "myTextInput"}), 
        React.createElement("input", {type: "button", value: "Focus the text input", onClick: this.handleClick})
      )
    );
  }
});

ReactDOM.render(
  React.createElement(MyComponent, null),
  document.getElementById('example')
);
// 上面代码中，组件 MyComponent 的子节点有一个文本输入框，用于获取用户的输入。这时就必须获取真实的 DOM 节点，
// 虚拟 DOM 是拿不到用户输入的。为了做到这一点，文本输入框必须有一个 ref 属性，
// 然后 this.refs.[refName] 就会返回这个真实的 DOM 节点。
// 需要注意的是，由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，
// 才能使用这个属性，否则会报错。上面代码中，通过为组件指定 Click 事件的回调函数，
// 确保了只有等到真实 DOM 发生 Click 事件之后，才会读取 this.refs.[refName] 属性。











