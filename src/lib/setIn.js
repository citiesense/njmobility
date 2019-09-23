/*@flow*/
import * as I from 'immutable';

type PathT = string;

type SetInPayloadT = {
  path: PathT,
  value: any,
};

const createUpdater = v => (...args) =>
  typeof v === 'function' ? v(...args) : v;

const delve = (s, i, arr) => {
  if (i === arr.length + 1) return s;
  s = s.updateIn(arr.slice(0, i - 1), v => v || I.Map());
  return delve(s, i + 1, arr);
};

const prepareKeyPath = (state, keyPath) => {
  return state.hasIn(keyPath) ? state : delve(state, 0, keyPath);
};

type SetFnT = (o: SetInPayloadT) => any;
const setIn = (state: any): SetFnT => (props: SetInPayloadT) => {
  const { path, value } = props;
  const updater = createUpdater(value);

  if (!path) return updater(state);

  // Split it into array using dot.
  const keyPath = path.split('.');
  state = prepareKeyPath(state, keyPath);
  return state.updateIn(keyPath, updater);
};

// Usage:
//    setIn(state)(['app', 'tasks'], (v) => v.set('done', true), {f: true})
//    setIn(state)('app.tasks', (v) => v.set('done', true))
export default setIn;
