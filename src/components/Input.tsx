import React, { Fragment } from 'react';
import styled from 'styled-components';

import { white, gray300, gray500, gray600, red400 } from '../utils/colors';

export interface Props {
  value: string
  onChange(e: string): void
  error?: boolean
  label: string
  id?: string
  placeholder?: string
  type: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void
  inputStaticText?: string
}

export const Input = ({ value, onChange, error, label, id, placeholder, type, autoFocus, onKeyDown, inputStaticText }: Props) => (
  <Fragment>
    {label && <Label htmlFor={id}>{label}</Label>}
    <InputWrapper>
      <StyledInput
        type={type || 'text'}
        id={id}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        error={error}
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
      {inputStaticText && <InputStaticText disabled text={inputStaticText}></InputStaticText>}
    </InputWrapper>
  </Fragment>
)

const Label = styled.label`
  font-size: .875rem;
  line-height: 1.25em;
  font-weight: 500;
  color: ${gray600};
`;

const InputWrapper = styled.div`
  border: 0 solid #d2d6dc;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  margin-top: 0.25rem;
  position: relative;
  width: 100%;

  *, &:after, &:before {
    box-sizing: border-box;
    border: 0 solid #d2d6dc;
  }
`;

const StyledInput = styled.input<{ error: boolean | undefined }>`
  line-height: 1.25em;
  width: 100%;
  font-size: 0.875em;
  display: block;
  background-color: ${white};
  border-color: ${p => p.error ? red400 : gray300};
  border-width: 1px;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;

  *, &:after, &:before {
    box-sizing: border-box;
    border: 0 solid #d2d6dc;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(164,202,254,.45);
    border-color: #a4cafe;
  }
`;

export const InputStaticText = styled.label<{ text: string, disabled: boolean }>`
  top: 0;
  right: 0;
  position: absolute;

  &::after {
    content: "${p => p.text}";
    position: absolute;
    top: 0.65em;
    right: 0.75em;
    font-family: arial,helvetica,sans-serif;
    font-size: 1em;
    display: block;
    color: ${gray500};
    font-weight: bold;
  }
`;