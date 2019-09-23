/* flow*/
// see: https://github.com/JakeSidSmith/react-fastclick/blob/master/src/index.js
import React from 'react';

const originalCreateElement = React.createElement;

// Moved if Math.abs(downX - upX) > MOVE_THRESHOLD;
const MOVE_THRESHOLD = 8;
const TOUCH_DELAY = 1000;

const touchKeysToStore = [
  'clientX',
  'clientY',
  'pageX',
  'pageY',
  'screenX',
  'screenY',
  'radiusX',
  'radiusY',
];

const touchEvents = {
  downPos: {},
  lastPos: {},
};

const isDisabled = function(element) {
  if (!element) {
    return false;
  }
  const disabled = element.getAttribute('disabled');

  return disabled !== false && disabled !== null;
};

const focus = function(event, target) {
  const myTarget = target || event.currentTarget;

  if (!myTarget || isDisabled(myTarget)) {
    return;
  }

  myTarget.focus();
};

const handleType = {
  input(event) {
    focus(event);
    event.stopPropagation();
  },
  textarea(event) {
    focus(event);
    event.stopPropagation();
  },
  select(event) {
    focus(event);
    event.stopPropagation();
  },
  label(event) {
    let input;

    const forTarget = event.currentTarget.getAttribute('for');

    if (forTarget) {
      input = document.getElementById(forTarget);
    } else {
      input = event.currentTarget.querySelectorAll(
        'input, textarea, select'
      )[0];
    }

    if (input) {
      focus(event, input);
    }
  },
};

const fakeClickEvent = function(event) {
  if (typeof event.persist === 'function') {
    event.persist();
  }

  event.fastclick = true;
  event.type = 'click';
  event.button = 0;
};

const copyTouchKeys = function(touch, target) {
  if (typeof target.persist === 'function') {
    target.persist();
  }

  if (touch) {
    touchKeysToStore.forEach(key => {
      target[key] = touch[key];
    });
  }
};

const noTouchHappened = function() {
  return (
    !touchEvents.touched &&
    (!touchEvents.lastTouchDate ||
      new Date().getTime() > touchEvents.lastTouchDate + TOUCH_DELAY)
  );
};

const invalidateIfMoreThanOneTouch = function(event) {
  touchEvents.invalid =
    (event.touches && event.touches.length > 1) || touchEvents.invalid;
};

const onMouseEvent = function(callback, event) {
  const touched = !noTouchHappened();

  // Prevent mouse events on other elements
  if (touched && event.target !== touchEvents.target) {
    event.preventDefault();
  }

  // Prevent any mouse events if we touched recently
  if (typeof callback === 'function' && !touched) {
    callback(event);
  }

  if (event.type === 'click') {
    touchEvents.invalid = false;
    touchEvents.touched = false;
    touchEvents.moved = false;
  }
};

const onTouchStart = function(callback, event) {
  touchEvents.invalid = false;
  touchEvents.moved = false;
  touchEvents.touched = true;
  touchEvents.target = event.target;
  touchEvents.lastTouchDate = new Date().getTime();

  copyTouchKeys(event.touches[0], touchEvents.downPos);
  copyTouchKeys(event.touches[0], touchEvents.lastPos);

  invalidateIfMoreThanOneTouch(event);

  if (typeof callback === 'function') {
    callback(event);
  }
};

const onTouchMove = function(callback, event) {
  touchEvents.touched = true;
  touchEvents.lastTouchDate = new Date().getTime();

  copyTouchKeys(event.touches[0], touchEvents.lastPos);

  invalidateIfMoreThanOneTouch(event);

  if (
    Math.abs(touchEvents.downPos.clientX - touchEvents.lastPos.clientX) >
      MOVE_THRESHOLD ||
    Math.abs(touchEvents.downPos.clientY - touchEvents.lastPos.clientY) >
      MOVE_THRESHOLD
  ) {
    touchEvents.moved = true;
  }

  if (typeof callback === 'function') {
    callback(event);
  }
};

const onTouchEnd = function(callback, onClick, type, event) {
  touchEvents.touched = true;
  touchEvents.lastTouchDate = new Date().getTime();
  invalidateIfMoreThanOneTouch(event);

  if (typeof callback === 'function') {
    callback(event);
  }

  if (!touchEvents.invalid && !touchEvents.moved) {
    // let box = event.currentTarget.getBoundingClientRect();

    // const rx = touchEvents.lastPos.radiusX || 0;
    // const ry = touchEvents.lastPos.radiusY || 0;
    // const cx = touchEvents.lastPos.clientX || 0;
    // const cy = touchEvents.lastPos.clientY || 0;

    // const lastPosInsideTarget =
    //   cx - rx <= box.right &&
    //   cx + rx >= box.left &&
    //   cy - ry <= box.bottom &&
    //   cy + ry >= box.top;

    // NOTE: in some clients touchEvents.lastPos is an empty object. Not sure
    // why this is happening. It's likely that touchstart is not firing.
    // const lastPosMissing = Object.keys(touchEvents.lastPos || {}).length === 0;

    if (!isDisabled(event.currentTarget)) {
      if (typeof onClick === 'function') {
        copyTouchKeys(touchEvents.lastPos, event);
        fakeClickEvent(event);

        onClick(event);
      }

      if (!event.defaultPrevented && handleType[type]) {
        handleType[type](event);
      }
    }
  }
};

const propsWithFastclickEvents = function(type, props) {
  let newProps = {};

  // Loop over props
  Object.keys(props).forEach(key => {
    // Copy props to newProps
    newProps[key] = props[key];
  });

  // Apply our wrapped mouse and touch handlers
  newProps.onClick = onMouseEvent.bind(null, props.onClick);
  newProps.onMouseDown = onMouseEvent.bind(null, props.onMouseDown);
  newProps.onMouseMove = onMouseEvent.bind(null, props.onMouseMove);
  newProps.onMouseUp = onMouseEvent.bind(null, props.onMouseUp);
  newProps.onTouchStart = onTouchStart.bind(null, props.onTouchStart);
  newProps.onTouchMove = onTouchMove.bind(null, props.onTouchMove);
  newProps.onTouchEnd = onTouchEnd.bind(
    null,
    props.onTouchEnd,
    props.onClick,
    type
  );

  if (typeof Object.freeze === 'function') {
    Object.freeze(newProps);
  }

  return newProps;
};

React.createElement = function() {
  // Convert arguments to array
  let args = Array.prototype.slice.call(arguments);

  const type = args[0];
  const props = args[1];

  // Check if basic element & has onClick prop
  if (
    type &&
    typeof type === 'string' &&
    ((props && typeof props.onClick === 'function') || handleType[type])
  ) {
    // Add our own events to props
    args[1] = propsWithFastclickEvents(type, props || {});
  }

  // Apply args to original createElement function
  return originalCreateElement.apply(null, args);
};
