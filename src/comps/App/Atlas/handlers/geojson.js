/*@flow*/
import type { Map, LayerType, GeoJSONSource } from 'mapbox-gl';
import type { EventMap } from '../';
import * as I from 'immutable';

type DataT = { properties: Object, geometry: Object };
type Optional = {
  layout: Object,
  paint: Object,
  placeBefore?: string,
  events: EventMap,
};
type DeckT = {|
  id: string,
  type: LayerType,
  data: DataT[],
|} & $Shape<Optional>;

const getFeatures = data =>
  data.map(v => ({
    type: 'Feature',
    properties: v.properties,
    geometry: v.geometry,
  }));

const getFeatureCollection = data => ({
  type: 'FeatureCollection',
  features: getFeatures(data),
});

const mkLayer = ({ data, ...rest }: DeckT) => ({
  ...rest,
  type: 'symbol',
  source: {
    type: 'geojson',
    data: getFeatureCollection(data),
  },
});

export default (deck: DeckT, map: Map) => {
  const bind = o => map.on(o[0], deck.id, o[1]);
  const unbind = o => map.off(o[0], deck.id, o[1]);

  return {
    enable() {
      const layer = mkLayer(deck);
      const layers = map.getStyle().layers || [];
      if (
        deck.placeBefore &&
        layers.map(v => v.id).includes(deck.placeBefore)
      ) {
        map.addLayer(layer, deck.placeBefore);
      } else {
        map.addLayer(layer);
      }

      const ev = deck.events || {};
      Object.keys(ev).forEach(k => bind([k, ev[k]]));
    },
    update(newDeck: DeckT) {
      if (!I.is(I.fromJS(newDeck.data), I.fromJS(deck.data))) {
        const source: GeoJSONSource = (map.getSource(newDeck.id): any);
        source.setData(getFeatureCollection(newDeck.data));
      }

      deck = newDeck;
    },
    disable() {
      if (map.getLayer(deck.id)) {
        map.removeLayer(deck.id);
        const ev = deck.events || {};
        Object.keys(deck.events || {}).forEach(k => unbind([k, ev[k]]));
      }
    },
  };
};
