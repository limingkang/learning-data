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
























