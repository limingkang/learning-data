"use strict";
import React, { Component, PropTypes } from "react";
import Notes_item from "./Notes_item.jsx";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "../../stylesheets/transition.scss";

class Notes_list extends React.Component{
	render(){
		var notes=this.props.notes;
		var notes_items=notes.map( (note,index) => {
			return <Notes_item key={ index } title={ note.title } description={ note.description } 
				date={ note.date } onDeleteNote={ this.props.onDeleteNote }/>;
		});
		return(
			<div className="notes_list">
				<ReactCSSTransitionGroup 
				transitionName="notes" 
				transitionEnterTimeout={500}
          				transitionLeaveTimeout={500}>
					{ notes_items }
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

Notes_list.propTypes = {
	notes : PropTypes.arrayOf(
			PropTypes.shape({
				title : PropTypes.string.isRequired,
				description : PropTypes.string.isRequired,
				date : PropTypes.string.isRequired
			}).isRequired
		).isRequired
}

export default Notes_list;



// React.addons.CSSTransitionGroup 的原理非常简单，通过 CSSTransitionGroup 标签来指定对一个DOM列表进行动画操作，通过 transitionName='my-animate-name' 来指定动画的名称。

// 当增加一项时，会自动在增加的那一项上增加两个类： {name}-enter 和 {name}-enter-active。CSS动画执行结束之后这两个类会被删掉。其中 {name}-enter 会在 {name}-enter-active 的前一帧被加上。因此 {name}-enter 用来定义动画的初始状态，{name}-enter-active 用来定义动画的结束状态。

// 当减少一项时，会自动在删除之前增加一个 {name}-leave 和 {name}-leave-active 类，这俩着的区别和前面的是一样的,所以我的样式动画中类为notes-enter什么的