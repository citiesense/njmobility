/*@flow*/
import React, { useState, useEffect } from 'react';
import Deck from './core/Deck';
import Atlas from './core/Atlas';
import Spinner from './ui/Spinner';
import LineIndicator from './ui/LineIndicator';
import Canvas from './ui/Canvas';
import * as I from 'immutable';

export type EventMap = { [key: string]: Function };
export type DeckType = {
  type: string,
  config: Object,
  placeBefore?: string,
  events?: EventMap,
};

type PropsT = {| decks: Object[], config: Object, loading?: boolean |};

const Container = (props: PropsT) => {
  const { decks, loading, config } = props;
  const [el, setEl] = useState(null);
  const [isEnabled, setEnabled] = useState(false);
  const [isEnabling, setEnabling] = useState(false);
  const [atlas, setAtlas] = useState();

  useEffect(() => {
    setAtlas(() => Atlas.create());
    return () => {
      setAtlas(undefined);
    };
  }, [el]);

  // TODO: pass atlas with useContext

  useEffect(() => {
    if (!atlas) return;
    const isConfigurable = !I.fromJS(config).isEmpty();
    const shouldEnable = isConfigurable && !isEnabling;
    let cancelablePromise;

    const onEnabled = newAtlas => {
      setEnabled(true);
      setEnabling(false);
      setAtlas(newAtlas);
    };

    const tryEnable = () => {
      if (!isEnabling && el) {
        setEnabling(true);
        atlas.enable(el, config).then(onEnabled);
        window.map = atlas.map;
      }
    };

    if (isEnabled) {
      atlas.update(config);
    } else if (shouldEnable) {
      tryEnable();
    }

    return () => {
      atlas && atlas.disable();
      cancelablePromise && cancelablePromise.cancel();
    };
  }, [atlas, config, el, isEnabled, isEnabling]);

  return (
    <Canvas className="atlas-canvas">
      {atlas && isEnabled && loading && <LineIndicator map={atlas.map} />}
      <div className="atlas-map" ref={e => e && setEl(e)} />
      <Spinner map={atlas && atlas.map} loading={Boolean(loading)} />
      {atlas &&
        isEnabled &&
        decks.map(
          c => atlas.map && <Deck config={c} map={atlas.map} key={c.id} />
        )}
    </Canvas>
  );
};

export default Container;
