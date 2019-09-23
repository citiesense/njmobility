/*@flow*/
import mapboxgl, { type Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as I from 'immutable';
import type { EventMap } from '../';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY2l0aWVzZW5zZSIsImEiOiJpcXhSRkdjIn0.5UdfHKjDqOusDF0CUNaQhw';

type Config = {|
  style: string,
  center: [number, number],
  zoom: number,
  attributionControl: boolean,
|} & $Shape<EventMap>;

export default class Atlas {
  map: ?Map;
  config: ?Config;

  map = null;
  enabled = false;
  config = null;

  static create = () => new Atlas();

  enable(el: HTMLElement, config: Config): Promise<*> {
    if (this.isEnabled()) return Promise.resolve();
    this.config = config;
    const map = new mapboxgl.Map({
      ...config,
      container: el,
    });
    this.map = map;
    this.enabled = true;

    const { events = {} } = this.config;
    Object.entries(events).forEach(
      ([key, fn]) => this.map && this.map.on(key, fn)
    );

    return new Promise(
      resolve => this.map && this.map.once('load', () => resolve(this))
    );
  }

  centerDidChange(newConfig: Config) {
    if (!this.config) return false;

    return (
      I.fromJS(newConfig.center).hashCode() !==
      I.fromJS(this.config && this.config.center).hashCode()
    );
  }

  update(newConfig: Config) {
    if (!this.isEnabled()) return;

    if (this.centerDidChange(newConfig)) {
      this.map && this.map.flyTo({ center: newConfig.center });
    }
    if (this.config && newConfig.resize !== this.config.resize) {
      this.map && this.map.resize();
    }
    this.config = newConfig;
  }

  disable() {
    if (!this.isEnabled()) return;
    this.enabled = false;

    const { events = {} } = this.config || {};
    Object.entries(events).forEach(
      ([key, fn]) => this.map && this.map.off(key, fn)
    );
  }

  isEnabled() {
    return this.enabled;
  }
}
