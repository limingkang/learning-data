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

var NotesList = React.createClass({displayName: "NotesList",
  render: function() {
    return (
      React.createElement("ol", null, 
      
        React.Children.map(this.props.children, function (child) {
          return React.createElement("li", null, child);
        })
      
      )
    );
  }
});

ReactDOM.render(
  React.createElement(NotesList, null, 
    React.createElement("span", null, "hello"), 
    React.createElement("span", null, "world")
  ),
  document.getElementById('example')
);
























