/*@flow*/
import ValueObject from 'lib/ValueObject';

export const SET_RECORD = 'SET_RECORD';
export const LEVEL = {
  SPINNER: 1043,
  MAP_COLUMN: 2000,
  PAGE_NAV: 1950,
};

export const PAGE_NAV_HEIGHT = ValueObject.create(40, 'px');
export const BREAKPOINT_MD_MAP_HEIGHT = ValueObject.create(200, 'px');
// Breakpoints
export const BREAKPOINT_XS = ValueObject.create(0, 'px');
export const BREAKPOINT_SM = ValueObject.create(576, 'px');
export const BREAKPOINT_MD = ValueObject.create(768, 'px');
export const BREAKPOINT_LG = ValueObject.create(992, 'px');
export const BREAKPOINT_XL = ValueObject.create(1200, 'px');
