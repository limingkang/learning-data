

import { createStore, combineReducers } from 'redux'

var reducer = combineReducers({
    speaker: function (state = {}, action) {
        console.log('speaker was called with state', state, 'and action', action)

        switch (action.type) {
            case 'SAY':
                return {
                    ...state,
                    message: action.message
                }
            default:
                return state;
        }
    }
})
var store_0 = createStore(reducer)

var asyncSayActionCreator_1 = function (message) {
    return function (dispatch) {
        setTimeout(function () {
            dispatch({
                type: 'SAY',
                message
            })
        }, 2000)
    }
}

console.log("\n", 'Running our async action creator:', "\n")
store_0.dispatch(asyncSayActionCreator_1('Hi'))

// 输出：
//     ...
//     /Users/classtar/Codes/redux-tutorial/node_modules/redux/node_modules/invariant/invariant.js:51
//         throw error;
//               ^
//     Error: Invariant Violation: Actions must be plain objects. Use custom middleware for async actions.
//     ...

// 所设计的 function 似乎没有进入 reducer 函数。但是 Redux 给出了温馨提示：使用自定义中间件（middleware）来支持异步 action。
// 这个异步 action creator 就会按照我们所设想的结果执行。

