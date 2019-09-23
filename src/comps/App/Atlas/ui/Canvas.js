/*@flow*/
import styled from '@emotion/styled';

export default styled.div`
  display: grid;
  position: relative;
  height: inherit;
  outline: none !important;
  background: white;
  .mapboxgl-ctrl-logo {
    display: none;
  }
  canvas {
    outline: none !important;
  }
  .atlas-map {
    height: inherit;
    outline: none;
  }
`;
