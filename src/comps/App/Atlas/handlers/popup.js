/*@flow*/
import type { Map, LngLatLike } from 'mapbox-gl';
import Popup from '../ui/Popup';
import React from 'react';

type DeckT = {|
  type: 'popup',
  lngLat: ?LngLatLike,
  content: () => React$Node,
  events: ?{ open?: Function, close?: Function },
|};

const mkPopup = d => {
  return <Popup {...d} />;
};

export default (deck: DeckT, map: Map) => {
  const eventHandler = key => deck.events && deck.events[key];
  const bind = key => {
    const fn = eventHandler(key);
    fn && map.on(key, fn);
  };
  const unbind = key => {
    const fn = eventHandler(key);
    fn && map.off(key, fn);
  };

  const handler = {
    enable() {
      // Bind open, close events
      Object.keys(deck.events || {}).forEach(bind);

      // Return popup to mount it as a React node
      return mkPopup({ ...deck, map });
    },
    update(_newDeck: DeckT) {
      deck = _newDeck;
      return mkPopup({ ...deck, map });
    },
    disable() {
      // Unbind open, close events
      Object.keys(deck.events || {}).forEach(unbind);
    },
  };

  return handler;
};
