var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];
var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
          return (
            React.createElement(Comment, {author: comment.author, text: comment.text})
          );
        });
    return (
        React.createElement("div", {className: "commentList"}, 
          commentNodes
        )
    );
  }
});

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    return (
      React.createElement("div", {className: "comment"}, 
        this.props.author, ":", this.props.text
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  render: function() {
    return (
      React.createElement("div", {className: "commentForm"}, 
       "i am conmmentform"
      )
    );
  }
});

var CommentBox = React.createClass({displayName: "CommentBox",
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement(CommentList, {name: "limingkang", data: this.props.data}), 
        React.createElement(CommentForm, null)
      )
    );
  }
});

ReactDOM.render(
    React.createElement(CommentBox, {data: data}),
    document.getElementById("example")
);