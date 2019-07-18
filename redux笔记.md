# redux 笔记

> 摘抄自 [Redux 中文文档](https://www.redux.org.cn/)  

## 自述
`Redux`  是 `JavaScript` 状态容器，提供可预测化的状态管理。 

### 安装Redux

```sh
yarn add redux
``` 

### 要点
应用中所有的 `state` 都存储在一个单一的 `store` 中。唯一能够改变 `state` 的办法就是触发 `action` —— 一个描述要做什么的对象。为了描述 `action` 如何改变 `state`， 需要编写 `reducers` 。  

```js
import { createStore } from 'redux'

/**
 * 这是一个reducer， 形式为 (state, action) => state 的纯函数。
 * 描述 action 如何把 state 转换成下一个 state
 * 
 * **要点**： state变化时需要返回全新的对象，而不是修改传入的参数
 * 
 */
function counter(state = 0, action){
  switch(action.type){
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default: 
      return state
  }
}

// 创建 Redux store 来存放应用的 state
// API 有 { subscribe, dispatch, getState }
let store = createStore(counter)

// 订阅更新， 可以绑定事件到视图层
store.subscribe(() => {
  console.log(store.getState())
})

// 改变 state 的唯一方式是 dispatch 一个 action
// action 可以被序列化，然后用于日志记录，便于后期回放操作
store.dispatch({ type: 'INCREMENT'})
// 1
store.dispatch({ type: 'INCREMENT'})
// 2
store.dispatch({ type: 'DECREMENT'})
// 1

```  

## 介绍

### 动机
随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state （状态）。  
管理不断变化的 state 非常困难，state 在什么时候，由于什么原因，如何变化常常无法控制。  
`Redux` 试图让 state 的变化变得可预测。这些限制条件反映在 `Redux` 的三大原则中。  

### 核心概念
Redux 本身很简单。
当使用普通对象来描述应用的state时， 例如，`todo应用` 的state可能长这样：  

```js
{
  todos: [    // 待办事项数组
    {
      text: 'Eat food',    // todo事项
      completed: true      // 完成标志
    },
    {
      text: 'Exercise',
      completed: false
    }],

  visibilityFilter: 'SHOW_COMPLETED'   // 待办事项显示过滤标志
}
```

要想更新 state 中的数据，需要发起一个 `action` 。 `action` 也是一个普通的 JavaScript 对象，用来描述发生了什么。 下面是一些 action 的示例：  

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }

{ type: 'TOGGLE_TODO', index: 1 }

{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

使用 `action` 来描述所有变化的好处是：可以清晰地知道应用中到底发生了什么。如果一些东西改变了，就可以知道为什么变。 `action` 就像是描述发生了什么的指示器。  

最后，为了把 `action` 和 `state` 串起来，需要开发一些函数，这就是 `reducers`。一般情况下不大可能仅仅写一个这样的函数，而是需要编写很多小函数分别管理 `state` 的一部分：  

```js
function visibilityFilter(state = 'SHOW_ALL', action){
  if ( action.type === 'SET_VISIBILITY_FILTER' ){
    return action.filter
  } else {
    return state
  }
}

function todos(state = [], action){
  switch (action.type) {
    case 'ADD_TODO':
      return {...state, { text: action.text, completed: false}}
    case 'TOGGLE_TODO':
      return state.map((item, index) => {
        action.index === index ? 
        { text: item.text, completed: !item.completed } : 
        item
      })
    default: 
      return state
  }
}
```

另外还需要一个 `reducer` 来调用这两个 `reducer`， 进而管理整个应用的 `state` ：  

```js
function todoApp(state = {}, action){
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}
```  

以上差不多就是 Redux 思想的全部内容。 Redux中有一些工具来简化这种模式，但是主要的想法是如何根据这些 `action` 来更新 `state`。  

### 三大原则

Redux的三个基本原则：  

#### 单一数据源

整个应用的 state 被存储在一颗 object tree 中， 并且这个 object tree 只存在于唯一的一个 `store` 中。  

```js
// 通过 store.getState() 获取 state
console.log(store.getState())
```

#### state是只读的

唯一改变 `state` 的办法就是触发 `action` ，`action` 是一个用于描述已发生事件的普通对象。 由于 `action` 是普通对象，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

#### 使用纯函数来执行修改

使用纯函数 `reducer` 来描述 `action` 如何改变 `state` 。 `reducer` 形式为 `(state, action) => state` 。刚开始可以只有一个 `reducer`，随着应用变大，可以把它拆成多个小的 `reducers` ，分别独立地操作 `state tree` 的不同部分。  

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'

let reducer = combineReducers({ visibilityFilter, todos })
let store = createStore(reducer)
```

### 先前技术

Redux 是一个混合产物。它和一些设计模式及技术相似，但也有不同之处。

#### Flux
`Redux` 可以被看作 `Flux` 的一种实现吗？ 是，也可以说 不是。  
`Flux` 常常被表述为 `(state, action) => state`。从这个意义上说，`Redux` 无疑是 `Flux` 架构的实现，且得益于纯函数而更为简单。  
不同于 `Flux`， **`Redux` 并没有 `dispatcher` 的概念**，原因是它依赖纯函数来替代事件处理器；另一个重要区别，是 **`Redux` 设想你永远不会变动你的数据**，所以应该在 `reducer` 中返回一个新对象来更新 `state`。虽然写不纯的 `reducer` 技术上可行，但是不纯的 `reducer` 会使一些开发特性，如时间旅行、记录/回放或热加载不可实现。  


