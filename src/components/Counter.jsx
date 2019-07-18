import React, { Component } from 'react'

export default class Counter extends Component{

  constructor(props){
    super(props)
    this.handleIncrementIfOdd = this.handleIncrementIfOdd.bind(this)
    this.handleIncrementAsync = this.handleIncrementAsync.bind(this)
  }

  handleIncrementIfOdd(){
    if(this.props.count % 2 !== 0){
      this.props.handleIncrement()
    }
  }

  handleIncrementAsync(){
    setTimeout(this.props.handleIncrement, 2000)
  }

  render(){
    return (
      <div>
        clicked: {this.props.count} times
        {' '}
        <button onClick={this.props.handleIncrement}>+1</button>
        {' '}
        <button onClick={this.props.handleDecrement}>-1</button>
        {' '}
        <button onClick={this.handleIncrementIfOdd}>+1 if odd</button>
        {' '}
        <button onClick={this.handleIncrementAsync}>+1 async</button>
      </div>
    )
  }
}