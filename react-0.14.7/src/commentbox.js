var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
          return (
            <Comment author={comment.author} text={comment.text} key={comment.text}/>
          );
        });
    return (
        <div className="commentList">
          {commentNodes}
        </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        {this.props.author}:{this.props.text}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList name="limingkang" data={this.props.data} />
        <CommentForm />
      </div>
    );
  }
});

ReactDOM.render(
    <CommentBox data={data} />,
    document.getElementById("example")
);