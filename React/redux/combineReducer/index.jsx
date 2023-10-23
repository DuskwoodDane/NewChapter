import React, { useEffect, useState } from 'react'

import { createStore, combineReducer } from './pubsub.js';
const initState = {
  counter: { count: 10 },
  others: { age: 20 }
}

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATECOUNT':
      return { ...state, count: action.data }
    default:
      return state
  }
}

const othersReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATEAGE':
      return { ...state, age: action.data }
      default:
        return state
  }
}

const reducers = combineReducer({
  counter: counterReducer,
  others: othersReducer
 })

const useHocState = createStore(initState, reducers);

export default function App() {

  const [sCount, setSCount] = useState(initState.counter.count);
  const [sAge, setAge] = useState(initState.others.age);

  const updateCount = () => {
    const count = useHocState.getState().counter.count;
    useHocState.dispatch({ type: 'UPDATECOUNT', data: count * 10})
  }

  const updateAge = () => {
    const age = useHocState.getState().others.age;
    useHocState.dispatch({ type: 'UPDATEAGE', data: age * 10})
  }

  useEffect(() => {
    useHocState.subscribe(() => {
      setSCount(useHocState.getState().counter.count);
      setAge(useHocState.getState().others.age);
    })
  }, [])
  return(
    <section>
      {sCount} --------------
      {sAge}

      <button onClick={updateCount}>count</button>
      <button onClick={updateAge}>age</button>
    </section>
  )
}