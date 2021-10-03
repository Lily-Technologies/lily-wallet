import React, { Fragment } from "react";
import styled from "styled-components";

import {
  white,
  gray300,
  gray700,
  red400,
  red500,
} from "../utils/colors";

interface Props {
  value: string;
  onChange(value: string): void;
  error?: string;
  label: string;
  id?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  largeText?: boolean;
  style?: object;
  labelStyle?: object;
  disabled?: boolean;
  rows?: number
  onPaste(value: string): void;
}

export const Textarea = ({
  value,
  onChange,
  error,
  label,
  id,
  placeholder,
  autoFocus,
  onKeyDown,
  style,
  labelStyle,
  largeText = false,
  disabled,
  rows = 6,
  onPaste
}: Props) => (
  <Fragment>
    {label && (
      <Label htmlFor={id} largeText={largeText} style={labelStyle}>
        {label}
      </Label>
    )}
    <InputAndErrorWrapper>
      <InputWrapper>
        <StyledTextarea
          id={id}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          onPaste={(e: React.ClipboardEvent) => {
            onPaste(e.clipboardData.getData("text"))
          }}
          onKeyDown={onKeyDown}
          error={!!error}
          autoFocus={autoFocus}
          placeholder={placeholder}
          largeText={largeText}
          style={style}
          disabled={disabled}
          rows={rows}
        />
      </InputWrapper>
      {!!error && <ErrorText>{error}</ErrorText>}
    </InputAndErrorWrapper>
  </Fragment>
);

const InputAndErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ErrorText = styled.div`
  color: ${red500};
  font-size: 0.75em;
  margin-top: 0.5em;
`;

const Label = styled.label<{ largeText: boolean }>`
  font-size: ${(p) => (p.largeText ? "1.15rem" : ".875rem")};
  line-height: ${(p) => (p.largeText ? "2.25em" : "1.25em")};
  font-weight: 500;
  color: ${gray700};
`;

const InputWrapper = styled.div`
  border: 0 solid #d2d6dc;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-top: 0.25rem;
  position: relative;
  width: 100%;

  *,
  &:after,
  &:before {
    box-sizing: border-box;
    border: 0 solid #d2d6dc;
  }
`;

const StyledTextarea = styled.textarea<{
  error: boolean | undefined;
  largeText: boolean;
  disabled?: boolean;
}>`
  font-size: ${(p) => (p.largeText ? "1rem" : ".875rem")};
  line-height: 1.25em;
  width: 100%;
  display: block;
  background-color: ${white};
  border-color: ${(p) => (p.error ? red400 : gray300)};
  border-width: 1px;
  border-radius: 0.375rem;
  padding: 1rem 1.25em;
  text-align: left;
  position: relative;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "text")}

  *,
  &:after,
  &:before {
    box-sizing: border-box;
    border: 0 solid #d2d6dc;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
    border-color: #a4cafe;
  }
`;
