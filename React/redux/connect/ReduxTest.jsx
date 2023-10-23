import React from 'react'
import { connect } from './connect';

function ReduxTest({ counter, handleAdd }) {
  return (
    <div>{counter.count}
    <button 
    onClick={() => handleAdd()}
    >+</button>
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
        counter: state.counter
    }
};

const mapDispatchToProps = (dispath) => {
    return {
        handleAdd() {
            dispath({ type: "ADD_COUNT" })
        }
    }
}
// connect 是 redux-react 提供的一个 API
// 接收两个函数，分别是 mapStateToProps, mapDispatchToProps
// 可以通过这两个函数，把 store 的数据, dispatch，作为 props，传入组件。
export default connect(mapStateToProps, mapDispatchToProps)(ReduxTest)