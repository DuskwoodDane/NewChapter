export const createStore = (initState, reducer) => {
  let state = initState;

  const listeners = [];

  function getState() {
    return state;
  }

  function subscribe(handler) {
    listeners.push(handler)
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(fn => fn())
  }

  return { getState, subscribe, dispatch }
}

export const combineReducer = (reducers) => {
  const keys = Object.keys(reducers);

  // dispatch的时候会将action传过来
  return (state = {}, action) => {
    const nextState = {};
    keys.forEach((key) => {
      // 获取每个分片绑定的reducer函数 () => {}
      const reducer = reducers[key];
      // 获取每个分片中的state {}
      const prev = state[key];
      // 在当前分片的reducer函数中去匹配action type
      const next = reducer(prev, action);
      // 获取并保存newVal
      nextState[key] = next;
    });
    // 返回一个新的分组state
    return nextState;
  }
}