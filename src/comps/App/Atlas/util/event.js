// @flow

export default class Event {
  +type: string;

  constructor(type: string, data: Object = {}) {
    // Add data to this object.
    Object.keys(data).forEach(key => ((this: any)[key] = data[key]));

    this.type = type;
  }
}
