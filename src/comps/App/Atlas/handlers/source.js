/*@flow*/
import type {
  Map,
  VectorTileSource,
  RasterTileSource,
  RasterDEMTileSource,
  GeoJSONSource,
  ImageSource,
  VideoSource,
} from 'mapbox-gl';
import type { EventMap } from '../';

function removeSource({ map, deck }) {
  // Get style
  const style = map.getStyle();
  // Sanity check
  if (!style) return;
  if (!style.layers) return;
  // Find source layers
  const layers = style.layers.filter(v => v.source === deck.id);
  // Remove them from map
  layers.forEach(v => map.removeLayer(v.id));
  // Remove source
  map.removeSource(deck.id);
}

function updateSource({ map, deck }) {
  // Get style
  const style = map.getStyle();
  // Sanity check
  if (!style) return;
  if (!style.layers) return;
  let layers = style.layers;
  // Remove source
  removeSource({ map, deck });
  // Add source
  map.addSource(deck.id, deck.config);
  // Add layers back to the map
  // Find source layers
  layers = layers.filter(v => v.source === deck.id);
  // Note: we're losing information about placement of the layers.
  // Better to use the deck config for this.
  layers.forEach(v => map.addLayer(v));
}

type DeckT = {|
  id: string,
  type: string,
  config: Object,
  events: EventMap,
|};

class Source {
  deck: DeckT;
  map: Map;
  source:
    | VectorTileSource
    | RasterTileSource
    | RasterDEMTileSource
    | GeoJSONSource
    | ImageSource
    | VideoSource;

  constructor(deck: DeckT, map: Map) {
    this.deck = deck;
    this.map = map;
  }

  enable() {
    const { deck, map } = this;
    if (!map.getSource(deck.id)) {
      let config = { ...deck.config, id: deck.id };
      map.addSource(deck.id, config);
      this.source = map.getSource(deck.id);
    }

    const bind = o => this.source.on(o[0], o[1]);
    const ev = deck.events || {};
    Object.keys(ev).forEach(k => bind([k, ev[k]]));
  }

  update(newDeck: DeckT) {
    const { deck, map } = this;
    this.source = map.getSource(deck.id);

    if (this.source) {
      // HACK: We don't have direct access to GeoJSONSource class in
      // mapbox-gl module to refine the type of the source, and importing
      // it from src is not possible since the library source code comes with
      // a lot of garbage dependencies.
      if ('setData' in this.source) {
        // $FlowFixMe
        this.source.setData(newDeck.config.data);
      }

      updateSource({ map, deck: newDeck });

      // Replace source
      this.source = map.getSource(newDeck.id);
    }
    this.deck = newDeck;
  }

  disable() {
    const { deck, map } = this;
    removeSource({ map, deck });

    const unbind = o => this.source.off(o[0], o[1]);
    const ev = deck.events || {};
    Object.keys(ev).forEach(k => unbind([k, ev[k]]));
  }
}

export default (deck: DeckT, map: Map) => new Source(deck, map);
