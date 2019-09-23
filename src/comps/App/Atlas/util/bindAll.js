// @flow

export default function(functions: string[], object: Object) {
  functions.forEach(f => {
    object[f] = object[f].bind(object);
  });
}
