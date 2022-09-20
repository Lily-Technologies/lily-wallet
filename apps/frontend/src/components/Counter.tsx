import React from 'react';
import styled from 'styled-components';
import { PlusIcon, MinusIcon } from '@heroicons/react/outline';

import { StyledIcon, Button } from 'src/components';
import { green400, green500, green600, gray400, gray500, white } from 'src/utils/colors';

interface Props {
  value: number;
  setValue: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

export const Counter = ({ value, setValue, minValue = 0, maxValue = Infinity }: Props) => {
  return (
    <div className='flex items-center justify-center h-full'>
      <IncrementButton
        data-cy='decrement-button'
        onClick={() => setValue(value - 1)}
        disabled={value - 1 < minValue}
      >
        <MinusIcon className='w-20 h-20' />
      </IncrementButton>
      <div
        className='flex items-center justify-center text-3xl text-slate-900 dark:text-slate-100 w-20'
        data-cy='required-devices'
      >
        {value}
      </div>
      <IncrementButton
        data-cy='increment-button'
        onClick={() => setValue(value + 1)}
        disabled={value + 1 > maxValue}
      >
        <PlusIcon className='w-20 h-20' />
      </IncrementButton>
    </div>
  );
};

const IncrementButton = styled.button<{ disabled: boolean }>`
  border-radius: 9999px;
  border: 1px solid ${(p) => (p.disabled ? gray400 : green500)};
  background: ${(p) => (p.disabled ? 'transparent' : green400)};
  color: ${(p) => (p.disabled ? gray500 : white)};
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};

  &:hover {
    background: ${(p) => !p.disabled && green400};
  }

  &:active {
    background: ${(p) => !p.disabled && green600};
  }
`;
