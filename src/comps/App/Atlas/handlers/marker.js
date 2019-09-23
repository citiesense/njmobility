/*@flow*/
import type { Map } from 'mapbox-gl';
import type { EventMap } from '../';

type TooltipOptions = {
  fields: { [key: string]: string | number },
};

type DeckT = {|
  id: string,
  type: string,
  pulsate?: boolean,
  tooltip?: TooltipOptions,
  events: EventMap,
|};

export default (deck: DeckT, map: Map) => {
  return {
    enable() {},
    update(newDeck: DeckT) {},
    disable() {},
  };
};
