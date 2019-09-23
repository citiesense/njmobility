// @flow
/** @jsx jsx */
import { LngLat, type LngLatLike, Map, type Anchor } from 'mapbox-gl';
import smartWrap from '../../util/smart_wrap';
import type { PointLike } from '@mapbox/point-geometry';
import ReactDOM from 'react-dom';
import React from 'react';
import Event from '../../util/event';
import cx from 'classnames';
import normalizeOffset from './normalizeOffset';
import { jsx, css } from '@emotion/core';
import * as I from 'immutable';

const anchorTranslate = {
  center: 'translate(-50%,-50%)',
  top: 'translate(-50%,0)',
  'top-left': 'translate(0,0)',
  'top-right': 'translate(-100%,0)',
  bottom: 'translate(-50%,-100%)',
  'bottom-left': 'translate(0,-100%)',
  'bottom-right': 'translate(-100%,-100%)',
  left: 'translate(0,-50%)',
  right: 'translate(-100%,-50%)',
};

const defaultOptions = {
  closeButton: false,
  closeOnClick: true,
  hideTip: false,
  className: '',
  content: () => null,
};

export type Offset = number | PointLike | { [Anchor]: PointLike };

type Props = {
  map: Map,
  content: () => React$Node,

  closeButton?: boolean,
  closeOnClick?: boolean,
  hideTip?: boolean,
  anchor?: Anchor,
  offset?: Offset,
  className?: string,
  lngLat: ?LngLatLike,
};

type State = {
  ...Props,
  containerStyle: string,
  anchor: Anchor,
  isOpen: boolean,
  isMounted: boolean,
};

/**
 * A popup component.
 *
 * @param {Object} [state]
 * @param {boolean} [state.closeButton=true] If `true`, a close button will appear in the
 *   top right corner of the popup.
 * @param {boolean} [state.closeOnClick=true] If `true`, the popup will closed when the
 *   map is clicked.
 * @param {string} [state.anchor] - A string indicating the part of the Popup that should
 *   be positioned closest to the coordinate set via {@link Popup#setLngLat}.
 *   Options are `'center'`, `'top'`, `'bottom'`, `'left'`, `'right'`, `'top-left'`,
 *   `'top-right'`, `'bottom-left'`, and `'bottom-right'`. If unset the anchor will be
 *   dynamically set to ensure the popup falls within the map container with a preference
 *   for `'bottom'`.
 * @param {number|PointLike|Object} [state.offset] -
 *  A pixel offset applied to the popup's location specified as:
 *   - a single number specifying a distance from the popup's location
 *   - a {@link PointLike} specifying a constant offset
 *   - an object of {@link Point}s specifing an offset for each anchor position
 *  Negative offsets indicate left and up.
 * @param {string} [state.className] Space-separated CSS class names to add to popup container
 * @example
 * var markerHeight = 50, markerRadius = 10, linearOffset = 25;
 * var popupOffsets = {
 *  'top': [0, 0],
 *  'top-left': [0,0],
 *  'top-right': [0,0],
 *  'bottom': [0, -markerHeight],
 *  'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
 *  'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
 *  'left': [markerRadius, (markerHeight - markerRadius) * -1],
 *  'right': [-markerRadius, (markerHeight - markerRadius) * -1]
 *  };
 */
export default class Popup extends React.Component<Props, State> {
  _container: HTMLDivElement;
  _lngLat: LngLat;

  constructor(props: Props = {}) {
    super();
    this.state = {
      ...defaultOptions,
      ...props,
      containerStyle: '',
      isOpen: false,
      isMounted: false,
    };
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
    this.removeFromMap();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.lngLat) {
      const newLngLat = I.fromJS(this.props.lngLat);

      const lngLatChanged = !I.is(I.fromJS(prevProps.lngLat), newLngLat);

      if (lngLatChanged) {
        this.setCoords(newLngLat.toJS());
        this.setState({ isOpen: true });
      }
    } else if (prevProps.lngLat) {
      this.setState({ isOpen: false });
    }

    const newContainerStyle = this.getContainerStyle();
    if (this.state.containerStyle !== newContainerStyle) {
      this.setState({
        containerStyle: newContainerStyle,
      });
    }

    if (this.state.isOpen && !prevState.isOpen) {
      this.addToMap();
    }
  }

  getCoords() {
    return this._lngLat || this.props.lngLat;
  }

  setCoords(lngLat: LngLat) {
    this._lngLat = lngLat;
  }

  _onClickClose = () => this.removeFromMap();

  _update = () => {
    this.forceUpdate();
  };

  /**
   * Adds the popup to a map.
   *
   * @param {Map} map The Mapbox GL JS map to add the popup to.
   * @returns {Popup} `this`
   */
  addToMap() {
    const { map } = this.props;
    map.on('move', this._update);

    if (this.state.closeOnClick) {
      map.on('click', this._onClickClose);
    }
    map.on('remove', this.removeFromMap);

    /**
     * Fired when the popup is opened manually or programatically.
     *
     * @event open
     * @memberof Popup
     * @instance
     * @type {Object}
     * @property {Popup} popup object that was opened
     */
    map.fire(new Event('open'));
  }

  /**
   * Removes the popup from the map it has been added to.
   */
  removeFromMap = () => {
    const { map } = this.props;

    if (map) {
      map.off('move', this._update);
      map.off('click', this._onClickClose);
      map.off('remove', this.removeFromMap);
    }

    /**
     * Fired when the popup is closed manually or programatically.
     *
     * @event close
     * @memberof Popup
     * @instance
     * @type {Object}
     * @property {Popup} popup object that was closed
     */
    map.fire(new Event('close'));

    if (this.state.isMounted) {
      this.setState({ isOpen: false });
    }
  };

  getPos() {
    return this.props.map.project(this.getCoords());
  }

  getOffset() {
    return normalizeOffset(this.state.offset);
  }

  getAnchor() {
    const pos = this.getPos();
    const { map } = this.props;

    if (map.transform.renderWorldCopies) {
      const lngLat = smartWrap(this.getCoords(), pos, map.transform);
      this.setCoords(lngLat);
    }

    let anchor: ?Anchor = this.state.anchor;

    const width = this._container.offsetWidth;
    const height = this._container.offsetHeight;
    let anchorComponents;

    const offset = this.getOffset();

    if (pos.y + offset.bottom.y < height) {
      anchorComponents = ['top'];
    } else if (pos.y > map.transform.height - height) {
      anchorComponents = ['bottom'];
    } else {
      anchorComponents = [];
    }

    if (pos.x < width / 2) {
      anchorComponents.push('left');
    } else if (pos.x > map.transform.width - width / 2) {
      anchorComponents.push('right');
    }

    if (anchorComponents.length === 0) {
      anchor = 'bottom';
    } else {
      anchor = (anchorComponents.join('-'): any);
    }

    return anchor;
  }

  getOffsetPos() {
    const pos = this.getPos();
    const anchor = this.getAnchor();
    const offset = this.getOffset();
    return pos.add(offset[anchor]).round();
  }

  getAnchorClass() {
    const anchor = this.getAnchor();
    const prefix = 'popup';
    return `mapboxgl-${prefix}-anchor-${anchor}`;
  }

  getContainerStyle() {
    if (!this._container) return '';
    const anchor: Anchor = this.getAnchor();
    const offsetedPos = this.getOffsetPos();
    const translation = anchorTranslate[anchor];
    const { x, y } = offsetedPos;
    return `${translation} translate(${x}px, ${y}px)`;
  }

  getContainerClass() {
    if (!this._container) return '';
    return cx('mapboxgl-popup', this.state.className, this.getAnchorClass());
  }

  getContent() {
    return (
      <div className="mapboxgl-popup-content">
        {this.state.closeButton && (
          <button
            className="mapboxgl-popup-close-button"
            ariaLabel="Close popup"
            onClick={this._onClickClose}
          >
            &#215
          </button>
        )}
        {this.state.content && React.createElement(this.state.content)}
      </div>
    );
  }

  isOpen() {
    const { map } = this.props;
    return map && this.getCoords() && map.getContainer() && this.state.isOpen;
  }

  render() {
    if (!this.isOpen()) return null;
    const { map } = this.props;

    const container = (
      <div
        className={this.getContainerClass()}
        css={css(`transform: ${this.state.containerStyle}`)}
        ref={el => el && (this._container = el)}
      >
        {!this.props.hideTip && <div className="mapboxgl-popup-tip" />}
        {this.getContent()}
      </div>
    );

    return ReactDOM.createPortal(container, map.getContainer());
  }
}
