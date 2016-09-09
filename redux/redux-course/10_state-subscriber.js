//  _________      _________       ___________
// |         |    | Change  |     |   React   |
// |  Store  |----▶ events  |-----▶   Views   |
// |_________|    |_________|     |___________|

// 没有它，在 store 改变时我们就不能更新我们的视图。

// 幸运的是，监视 Redux store 更新有一个很简单的办法：

/*
    store.subscribe(function() {
        // retrieve latest store state here
        // Ex:
        console.log(store.getState());
    })
*/

import { createStore, combineReducers } from 'redux'

var itemsReducer = function (state = [], action) {
    console.log('itemsReducer was called with state', state, 'and action', action)

    switch (action.type) {
        case 'ADD_ITEM':
            return [
                ...state,
                action.item
            ]
        default:
            return state;
    }
}

var reducer = combineReducers({ items: itemsReducer })
var store_0 = createStore(reducer)

store_0.subscribe(function() {               //因为已经监听了，所以每一次dispatch的时候就会走一下这个方法
    console.log('store_0 has been updated. Latest store state:', store_0.getState());
    // 在这里更新你的视图
})

var addItemActionCreator = function (item) {
    return {
        type: 'ADD_ITEM',
        item: item
    }
}

store_0.dispatch(addItemActionCreator({ id: 1234, description: 'anything' }))

// 输出:
//     ...
//     store_0 has been updated. Latest store state: { items: [ { id: 1234, description: 'anything' } ] }

// 我们的订阅回调成功的调用了，同时 store 现在包含了我们新增的条目。

// 理论上，到这就可以停止了。我们的 Flux loop 已经闭合，我们理解了构造 Flux 的全部概念，

// - 我们的订阅回调没有把 state 作为参数，为什么？
// - 既然我们没有接受新的 state， 我们就被限定到了只能开发这个已经完成的 store (store_0) 所以这个办法在
//     含有多个模块的应用下不可行。

// 我们现在进入了一个”将 Redux 加入到 React“ 的领域。
// 理解 Redux 可以无条件绑定到 React 上是很重要的。
// Redux 是一个”为 Javascript 应用而生的可预测的状态容器“，
// 你有很多方式去使用它，而 React 应用只不过是其中一个。

// 从这个角度看，如果没有 react-redux (https://github.com/rackt/react-redux)，我们将失去很多。
// 在 Redux 1.0.0 之前它是包含在 Redux 中的，这个库节省了我们很多时间，
// 它包含了在 React 中使用 Redux 时所有的绑定。

// Redux所有 API 都很抽象（包括订阅），
// 支持高度扩展，允许开发者造出一些疯狂的轮子
// 比如 Redux DevTools (https://github.com/gaearon/redux-devtools).

// 但是最后我们还是需要一个更好的接口订阅我们的 store 变化。这也就是 react-redux 给带给我们的：
// 一个完美填补原生 Redux 订阅机制和开发者的期待之间的空缺的 API ，
// 这样我们不再需要直接使用订阅。而只是
// 使用 “provide” 和 ”connect“ 绑定，不必再关心隐含在内的订阅方法。
// 所以，订阅方法依然会被我们使用，
// 只不过它通过高度整合的接口替我们处理 redux state 的连接。

