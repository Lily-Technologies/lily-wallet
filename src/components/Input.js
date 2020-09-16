import React from 'react';
import styled from 'styled-components';

import { white, gray300, gray600, red400 } from '../utils/colors';

export const Input = ({ value, onChange, error, label, id, placeholder, type }) => (
  <InputContainer>
    {label && <Label htmlFor={id}>{label}</Label>}
    <InputWrapper>
      <StyledInput
        type={type || 'text'}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        placeholder={placeholder}
      />
    </InputWrapper>
  </InputContainer>
)

const InputContainer = styled.div`
  margin: 1em 0;
`;

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

  *, &:after, &:before {
    box-sizing: border-box;
    border: 0 solid #d2d6dc;
  }
`;

const StyledInput = styled.input`
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