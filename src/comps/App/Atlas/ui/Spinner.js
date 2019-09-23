/*@flow*/
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type { Map } from 'mapbox-gl';
import waitTill from 'lib/waitTill';
import { LEVEL } from 'store/constants';
import Task from 'folktale/concurrency/task';

const Center = styled.div(`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: ${LEVEL.SPINNER};
  display: grid;
  justify-items: center;
  align-items: center;
  pointer-events: none;
`);

const CircleLoader = styled.div(
  `
  display: block;
  font-size: 0;
  color: #333;
  width: 32px;
  height: 32px;

  & > div {
      position: relative;
      box-sizing: border-box;
      display: inline-block;
      float: none;
      background-color: currentColor;
      border: 0 solid currentColor;
      width: 32px;
      height: 32px;
      background: transparent;
      border-width: 2px;
      border-bottom-color: transparent;
      border-radius: 100%;
      animation: ball-clip-rotate .75s linear infinite;
  }

  @keyframes ball-clip-rotate {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
);

type PropsT = {| map: ?Map, loading: boolean |};

const Component = (props: PropsT) => {
  const { map, loading } = props;
  const [isHidden, setHidden] = useState(Boolean(map && map.areTilesLoaded()));

  useEffect(() => {
    if (!map) return;

    let task;
    let execution;

    const onData = e => {
      if (e.dataType !== 'source') return;
      if (e.target.areTilesLoaded()) return;
      if (!execution) {
        setHidden(false);
        task = Task.fromPromised(() =>
          waitTill(() => e.target.areTilesLoaded())
        );
        execution = task()
          .map(_ => {
            execution = undefined;
            setHidden(true);
            return _;
          })
          .run();
      }
    };

    map.on('data', onData);

    setHidden(map.areTilesLoaded());

    return () => {
      execution && execution.cancel();
      map.off('data', onData);
    };
  }, [map]);

  if (isHidden && loading === false) return null;

  return (
    <Center>
      <CircleLoader>
        <div />
      </CircleLoader>
    </Center>
  );
};

export default Component;
