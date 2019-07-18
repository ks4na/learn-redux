import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

import { createStore } from 'redux'
import counter from './reducers/counter.js'
import Counter from './components/Counter.jsx'

let store = createStore(counter)
const render = () => {
  ReactDOM.render(
    <Counter
      count={store.getState()}
      handleIncrement={() => store.dispatch({ type: 'INCREMENT' })}
      handleDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />
    , document.querySelector('#app'))
}

render()
store.subscribe(render)


