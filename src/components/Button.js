import { css, keyframes } from 'styled-components';
import darken from 'polished/lib/color/darken';
import lighten from 'polished/lib/color/lighten';
import { white, blue400, blue500, blue700 } from '../utils/colors';

export const Button = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: .375rem;
  cursor: pointer;
  outline: 0;
  font-family: Montserrat, sans-serif;
  color: ${p => p.color ? p.color : white};
  background: ${p => p.background ? p.background : blue500};
  text-decoration: none;
  text-align: center;
  white-space: nowrap;

  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: .75rem;
  padding-bottom: .75rem;
  line-height: 1.5rem;
  font-weight: 500;

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgb(180,198,252);
    border-color: rgb(81,69,205);
  }

  &:hover {
    cursor: pointer;
    background: ${p => p.background ? lighten(0.1, p.background) : blue400};
    color: ${p => p.color ? lighten(0.1, p.color) : white};
  }

  &:active {
    outline: 0;
    background: ${p => p.background ? darken(0.1, p.background) : blue700};
    transform: scale(.99);
  }
`;

export const SidewaysShake = keyframes`
  0% { transform: translate3d(0px, 0, 0) }
  50% { transform: translate3d(5px, 0, 0) }
  100% { transform: translate3d(0px, 0, 0) }
`;