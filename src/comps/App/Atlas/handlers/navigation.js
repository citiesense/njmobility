/*@flow*/
import mapboxgl from 'mapbox-gl';
import type { Map, ControlAnchors } from 'mapbox-gl';

type DeckT = {|
  id: string,
  type: string,
  position: ControlAnchors,
  showZoom?: boolean,
  showCompass?: boolean,
|};

export default (deck: DeckT, map: Map) => {
  return {
    enable() {
      const {
        position = 'top-left',
        showZoom = false,
        showCompass = true,
      } = deck;
      map.addControl(
        new mapboxgl.NavigationControl({ showZoom, showCompass }),
        position
      );
    },
    update(newDeck: DeckT) {
      deck = newDeck;
    },
    disable() {
      // TODO: remove control
    },
  };
};
