import styled, { css } from 'styled-components';

import { red, gray, darkGray, darkOffWhite, lightGray } from '../../utils/colors';

export const AddressDisplayWrapper = styled.div`
  display: flex;
`;

export const InputStyles = css`
  border: ${p => p.error ? `1px solid ${red}` : `1px solid ${darkOffWhite}`};
  background: ${lightGray};
  padding: 1.5em;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  font-size: 1.5em;
  z-index: 1;

  ::placeholder {
              color: ${gray};
  }

  :active, :focused {
              outline: 0;
    border: none;
  }
`;

export const Input = styled.input`
  position: relative;
  text-align: right;
  ${InputStyles}
`;

export const InputStaticText = styled.label`
  position: relative;
  display: flex;
  flex: 0 0;
  justify-self: center;
  align-self: center;
  margin-left: -87px;
  z-index: 1;
  margin-right: 40px;
  font-size: 1.5em;
  font-weight: 100;
  color: ${gray};

  &::after {
              content: ${p => p.text};
    position: absolute;
    top: 4px;
    left: 94px;
    font-family: arial, helvetica, sans-serif;
    font-size: .75em;
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
  }
`;
