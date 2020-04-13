import { css } from 'styled-components';
import darken from 'polished/lib/color/darken';
import { white, blue } from '../utils/colors';

export const Button = css`
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: 0;
  font-family: Montserrat, sans-serif;
  color: ${p => p.color ? p.color : white};
  background: ${p => p.background ? p.background : blue};
  text-decoration: none;
  text-align: center;

  transition-duration: .2s;
  transition: all .2s ease-out;  

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