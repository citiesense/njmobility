/*@flow*/
import type { Map, Layer } from 'mapbox-gl';
import type { EventMap } from '../';

type DeckT = {
  id: string,
  type: 'layer',
  config: Layer,
  placeBefore?: string,
  events: EventMap,
};

export default (deck: DeckT, map: Map) => {
  const { id } = deck;
  const getLayer = () => map.getLayer(id);
  const hasLayer = () => getLayer() !== undefined;
  const bind = o => map.on(o[0], id, o[1]);
  const unbind = o => map.off(o[0], id, o[1]);

  const enable = () => {
    if (hasLayer()) return;
    let { config } = deck;
    const { source } = config;
    config = { ...config, id: deck.id };
    const hasStringSource = typeof source === 'string' && map.getSource(source);
    const addLayer = () => {
      if (hasLayer()) return;
      const layers = map.getStyle().layers || [];

      if (deck.placeBefore) {
        if (layers.map(v => v.id).includes(deck.placeBefore)) {
          map.addLayer(config, deck.placeBefore);
        } else {
          deck.placeBefore &&
            console.error(
              'Cannot place `' +
                deck.id +
                '` before `' +
                deck.placeBefore +
                '` because latter is not yet on the map.'
            );
        }
      } else {
        map.addLayer(config);
      }
    };

    if (!source) {
      addLayer();
    } else if (hasStringSource || typeof source === 'object') {
      addLayer();
    } else {
      setTimeout(enable, 100);
      return;
    }

    const ev = deck.events || {};
    Object.keys(ev).forEach(k => bind([k, ev[k]]));
  };

  const disable = () => {
    if (hasLayer()) {
      const ev = deck.events || {};
      Object.keys(ev).forEach(k => unbind([k, ev[k]]));
      map.removeLayer(id);
    }
  };

  return {
    enable,
    update(newDeck: DeckT) {
      deck = newDeck;
      // TODO: check is layer already enabled..
      // TODO: update something, but do not disable/enable for performance reasons.
    },
    disable,
  };
};
