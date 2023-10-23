import React, { useEffect, useState } from 'react'

import { createStore } from './pubsub.js';
const initState = {
  count: 1,
  age: 18
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATECOUNT':
      return { ...state, count: action.data }
    case 'UPDATEAGE':
      return { ...state, age: action.data }
    default:
      return state
  }
}

const useHocState = createStore(initState, reducer);

export default function App() {

  const [sCount, setSCount] = useState(initState.count);
  const [sAge, setAge] = useState(initState.age);

  const updateCount = () => {
    const count = useHocState.getState().count;
    useHocState.payload({ type: 'UPDATECOUNT', data: count * 10})
  }

  const updateAge = () => {
    const age = useHocState.getState().age;
    useHocState.payload({ type: 'UPDATEAGE', data: age * 10})
  }

  useEffect(() => {
    console.log(useHocState)
    useHocState.subscribe(() => {
      setSCount(useHocState.getState().count);
      setAge(useHocState.getState().age);
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