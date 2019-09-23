/*@flow*/
import React, { useState, useEffect } from 'react';
import handlers from '../handlers';
import { Map } from 'mapbox-gl';
import waitTill from 'lib/waitTill';

interface HandlerT {
  enable(): ?React$Node;
  update(any): ?React$Node;
  disable(): void;
}
type DeckT = $Shape<{
  type: string | ((DeckT, Map) => HandlerT),
  children: Map => React$Node,
}>;
type PropsT = { config: DeckT, map: Map };

export default function Deck(props: PropsT) {
  const { config, map } = props;
  const [handler, setHandler] = useState();
  const [isMounted, setMounted] = useState(true);
  const [elem1, setElem1] = useState(null);
  const [elem2, setElem2] = useState(null);

  useEffect(() => {
    let h;
    if (typeof config.type === 'function') {
      h = config.type(config, map);
    } else if (typeof config.type === 'string') {
      h = handlers(config, map);
    }
    setHandler(h);

    return () => {
      h && isMounted && h.disable();
      setMounted(false);
    };
  }, [config, isMounted, map]);

  useEffect(() => {
    if (!map || !handler) return;

    const enableDeck = () => {
      const el = handler.enable();
      el && isMounted && setElem1(el);
    };

    if (map.loaded()) {
      enableDeck();
    } else {
      waitTill(() => map.loaded()).then(enableDeck);
    }
  }, [map, handler, isMounted]);

  useEffect(() => {
    if (!map || !handler) return;

    const updateDeck = () => {
      const el = handler.update(config);
      el && isMounted && setElem2(el);
    };

    if (map.loaded()) {
      updateDeck();
    } else {
      waitTill(() => map.loaded()).then(updateDeck);
    }
  }, [config, map, handler, isMounted]);

  return (
    <React.Fragment>
      {elem1}
      {elem2}
    </React.Fragment>
  );
}
