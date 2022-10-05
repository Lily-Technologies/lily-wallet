import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Minus } from '@styled-icons/boxicons-regular';
import { ArrowRightIcon } from '@heroicons/react/outline';

import { StyledIcon, Button } from 'src/components';
import { green400, green500, green600, gray400, gray500, white } from 'src/utils/colors';
import { OnChainConfigWithoutId } from '@lily/types';

interface Props {
  newAccount: OnChainConfigWithoutId;
  onClick: (requiredSigners: number) => void;
}

const MAX_REQUIRED_SIGNERS = 15;

const RequiredDevicesModal = ({ newAccount, onClick }: Props) => {
  const [requiredSigners, setRequiredSigners] = useState(newAccount.quorum.requiredSigners);

  return (
    <>
      <h2 className='py-6 px-4 text-2xl font-medium text-slate-900 dark:text-slate-200 border-b border-slate-500 dark:border-slate-700'>
        How many devices are required to approve transactions?
      </h2>
      <SelectionContainer>
        <SelectionWrapper>
          <IncrementButton
            data-cy='decrement-button'
            onClick={() => setRequiredSigners(requiredSigners - 1)}
            disabled={requiredSigners - 1 === 0}
          >
            <StyledIcon as={Minus} size={25} />
          </IncrementButton>
          <div
            className='text-slate-900 dark:text-slate-200 px-8 py-4 text-4xl'
            data-cy='required-devices'
          >
            {requiredSigners}
          </div>
          <IncrementButton
            data-cy='increment-button'
            onClick={() => setRequiredSigners(requiredSigners + 1)}
            disabled={requiredSigners + 1 > MAX_REQUIRED_SIGNERS}
          >
            <StyledIcon as={Plus} size={25} />
          </IncrementButton>
        </SelectionWrapper>
        <ContinueButton
          background={green600}
          color={white}
          onClick={() => onClick(requiredSigners)}
        >
          Continue
          <ArrowRightIcon className='w-4 h-4 ml-2' />
        </ContinueButton>
      </SelectionContainer>
    </>
  );
};

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContinueButton = styled.button`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`;

const SelectionWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding: 4em;
  align-items: center;
  justify-content: center;
`;

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

export default RequiredDevicesModal;
