import React, { Fragment } from 'react';
import styled from 'styled-components';

import { red500 } from 'src/utils/colors';

import { classNames } from 'src/utils/other';

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
  rows?: number;
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
      <Label
        className='text-gray-700 dark:text-gray-200'
        htmlFor={id}
        largeText={largeText}
        style={labelStyle}
      >
        {label}
      </Label>
    )}
    <InputAndErrorWrapper>
      <InputWrapper>
        <StyledTextarea
          id={id}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onPaste={(e: React.ClipboardEvent) => {
            onPaste(e.clipboardData.getData('text'));
          }}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          largeText={largeText}
          style={style}
          disabled={disabled}
          rows={rows}
          className={classNames(
            !!error ? 'border-red-500' : 'border-gray-300 dark:border-gray-500',
            'text-gray-900 dark:text-gray-200 focus:ring-green-500 focus:border-green-500 focus:outline-none border'
          )}
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
  font-size: ${(p) => (p.largeText ? '1.15rem' : '.875rem')};
  line-height: ${(p) => (p.largeText ? '2.25em' : '1.25em')};
  font-weight: 500;
`;

const InputWrapper = styled.div`
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-top: 0.25rem;
  position: relative;
  width: 100%;
`;

const StyledTextarea = styled.textarea<{
  largeText: boolean;
  disabled?: boolean;
}>`
  font-size: ${(p) => (p.largeText ? '1rem' : '.875rem')};
  line-height: 1.25em;
  width: 100%;
  display: block;
  border-radius: 0.375rem;
  padding: 1rem 1.25em;
  text-align: left;
  position: relative;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'text')};
`;
