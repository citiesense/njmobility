/*@flow*/
import styled from '@emotion/styled';

export default styled.div(
  `
  animation: loader-progress 1000ms linear 1;
  opacity: 0;
  transition: opacity 1000ms;
  height: 2px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: rgba(17, 129, 251, 0.5);
  @keyframes loader-progress {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
  animation: loader-progress 2000ms linear infinite;
  opacity: 1;
  z-index: 1;
`
);
