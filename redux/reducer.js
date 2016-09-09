import { combineReducers } from 'redux'
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './action'
const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state = SHOW_ALL, action) {//这是es6的语法，意思如果state是undefined也就是没传的话，state就使用你参数内赋予的那个值
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp


// Redux 提供了 combineReducers() 工具类来做上面 todoApp 做的事情，这样就能消灭一些样板代码了
// 所做的只是生成一个函数，这个函数来调用你的一系列 reducer，每个 reducer 根据它们的 key 来筛选出 state 中的
// 一部分数据并处理，然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象：
// const todoApp = combineReducers({
//   visibilityFilter,
//   todos
// })
// export default todoApp;
// // 上面这个就等价于下面这个
// export default function todoApp(state = {}, action) {
//   return {
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action),
//     todos: todos(state.todos, action)
//   }
// }

// 你也可以给它们设置不同的 key，或者调用不同的函数。下面两种合成 reducer 方法完全等价
// const reducer = combineReducers({
//   a: doSomethingWithA,
//   b: processB,
//   c: c
// })
// function reducer(state = {}, action) {
//   return {
//     a: doSomethingWithA(state.a, action),
//     b: processB(state.b, action),
//     c: c(state.c, action)
//   }
// }