"use strict";
import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { Provider } from "react-redux";
import Notes from "./container/app.jsx";
import rootReducer from "./reducer/reducer.jsx";

var loggerMiddleware = createLogger();

//创建携带所传入中间件的store,这样允许我们 dispatch() 函数，就是参数里面可以是函数，loggerMiddleware一个很便捷的 middleware，用来打印 action 日志
//thunk 的一个优点是它的结果可以再次被 dispatch,每个函数里面有dispatch这个参数，直到dispatch()参数里面是一个action才可以更新view，以此来处理异步
var createStoreWithMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware)(createStore);

var store = createStoreWithMiddleware(rootReducer);

//监听state的每一次变化，若调用所返回函数unsubscribe( )，则监听取消
//Provider是和后面的connect相互结合，来返回你要的其他值
var unsubscribe = store.subscribe( () => console.log(store.getState()) );

var rootElement = document.getElementById("app");
ReactDOM.render(
	<Provider store = { store }>
		<Notes/>
	</Provider>,
	rootElement
);