export const createStore = (initState, reducer) => {
  let state = initState;

  const deps = [];

  function getState() {
    return state;
  }

  function subscribe(handle) {
    deps.push(handle)
  }

  function payload(action) {
    state = reducer(state, action);
    deps.forEach(fn => fn())
  }

  return { getState, subscribe, payload }
}
