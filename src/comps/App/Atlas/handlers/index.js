/*@flow*/
import { type Map } from 'mapbox-gl';
import geojson from './geojson';
import navigation from './navigation';
import layer from './layer';
import source from './source';
import popup from './popup';
import marker from './marker';

const m = {
  geojson,
  navigation,
  layer,
  source,
  popup,
  marker,
};

export default (deck: $Subtype<{ type: string | Function }>, map: Map) => {
  const h = m[deck.type];
  if (!h) throw new TypeError('Unknown deck handler: ' + deck.type);
  return h(deck, map);
};
