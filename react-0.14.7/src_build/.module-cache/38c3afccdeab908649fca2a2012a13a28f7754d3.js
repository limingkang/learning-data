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




// 组件类的PropTypes属性，就是用来验证组件实例的属性是否符合要求
var MyTitle = React.createClass({displayName: "MyTitle",
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },
  getDefaultProps : function () {
      return {
        title : 'Hello World'
      };
  },

  render: function() {
     return React.createElement("h1", null, " ", this.props.title, " ");
   }
});
// 上面的Mytitle组件有一个title属性。PropTypes 告诉 React，这个 title 属性是必须的，而且它的值必须是字符串。若设置 title 属性的值是一个数值就会报错
var data = 123;
ReactDOM.render(
  React.createElement(MyTitle, {title: data}),
  document.getElementById('example')
);



















