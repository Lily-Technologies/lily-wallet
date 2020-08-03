import { css, keyframes } from 'styled-components';
import darken from 'polished/lib/color/darken';
import { white, blue } from '../utils/colors';

export const Button = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  border: none;
  border-radius: .375rem;
  cursor: pointer;
  outline: 0;
  font-family: Montserrat, sans-serif;
  color: ${p => p.color ? p.color : white};
  background: ${p => p.background ? p.background : blue};
  text-decoration: none;
  text-align: center;
  white-space: nowrap;

  // transition-duration: .2s;
  // transition: all .2s ease-out;  

  &:focus, :active {
    outline: 0;
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    background: ${p => p.background ? darken(0.1, p.background) : darken(0.1, blue)};
    transform: scale(.99);
  }
`;

export const SidewaysShake = keyframes`
  0% { transform: translate3d(0px, 0, 0) }
  50% { transform: translate3d(5px, 0, 0) }
  100% { transform: translate3d(0px, 0, 0) }
`;