/*@flow*/
import type { Map } from 'immutable';
// ---------
import mapboxgl from 'mapbox-gl';
export type MapboxMapT = typeof mapboxgl.Map;
// Note: We generalize LonlatT as a union type to support the
// return types automatically generated from GraphQL schema, which
// does not have a notion of tuples yet.
export type LonLatT = number[];
