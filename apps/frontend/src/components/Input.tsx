import React from 'react';
import CSS from 'csstype';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { classNames } from 'src/utils/other';

export interface InputProps {
  error?: string;
  value: string;
  onChange(value: string): void;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  inputStaticText?: string;
  largeText?: boolean;
  readOnly?: boolean;
  style?: object;
  inputMode?: React.HTMLAttributes<HTMLLIElement>['inputMode'];
  labelClassNames?: string;
  labelStyle?: CSS.Properties;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent) => void;
}

export const Input = ({
  value,
  onChange,
  error,
  label,
  id,
  placeholder,
  autoComplete,
  className,
  type,
  name,
  autoFocus,
  onKeyDown,
  inputStaticText,
  style,
  inputMode,
  labelClassNames,
  labelStyle,
  largeText = false,
  readOnly = false,
  disabled,
  onBlur
}: InputProps) => (
  <>
    {label && (
      <label
        htmlFor={id}
        className={classNames(
          largeText ? 'text-lg' : 'text-sm',
          `block font-medium text-gray-700 dark:text-gray-200 ${labelClassNames}`
        )}
        style={labelStyle}
      >
        {label}
      </label>
    )}
    <div className='w-full mt-1 relative rounded-md shadow-sm'>
      <input
        type={type || 'text'}
        id={id}
        name={name}
        value={value}
        readOnly={readOnly}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onBlur={(e: React.FocusEvent) => onBlur && onBlur(e)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        placeholder={placeholder}
        style={style}
        disabled={disabled}
        className={classNames(
          className,
          error
            ? 'text-red-900 border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300',
          largeText ? 'px-4 py-3' : 'px-3 py-2',
          inputStaticText ? 'text-right pr-12' : '',
          inputStaticText && error ? 'pr-16' : '',
          error ? 'pr-8' : '',
          'dark:bg-transparent appearance-none block w-full border dark:border-gray-500 dark:text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm'
        )}
      />
      {inputStaticText && (
        <div
          className={classNames(
            error ? 'pr-8' : 'pr-3',
            'absolute inset-y-0 right-0 flex items-center pointer-events-none'
          )}
        >
          <span className='text-gray-500 dark:text-gray-200 sm:text-sm'>{inputStaticText}</span>
        </div>
      )}
      {error && (
        <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
          <ExclamationCircleIcon className='h-5 w-5 text-red-500' aria-hidden='true' />
        </div>
      )}
    </div>
    {!!error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
  </>
);
