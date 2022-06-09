import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Minus } from '@styled-icons/boxicons-regular';

import { StyledIcon, Button } from 'src/components';
import { green400, green500, green600, gray400, gray500, white } from 'src/utils/colors';
import { OnChainConfigWithoutId, VaultConfig } from '@lily/types';

interface Props {
  newAccount: OnChainConfigWithoutId;
  onClick: (requiredSigners: number) => void;
}

const RequiredDevicesModal = ({ newAccount, onClick }: Props) => {
  const [requiredSigners, setRequiredSigners] = useState(newAccount.quorum.requiredSigners);

  return (
    <>
      <ModalHeaderContainer>
        How many devices are required to approve transactions?
      </ModalHeaderContainer>
      <SelectionContainer>
        <SelectionWrapper>
          <IncrementButton
            data-cy='decrement-button'
            onClick={() => setRequiredSigners(requiredSigners - 1)}
            disabled={requiredSigners - 1 === 0}
          >
            <StyledIcon as={Minus} size={25} />
          </IncrementButton>
          <CurrentSelection data-cy='required-devices'>{requiredSigners}</CurrentSelection>
          <IncrementButton
            data-cy='increment-button'
            onClick={() => setRequiredSigners(requiredSigners + 1)}
            disabled={requiredSigners + 1 > newAccount.extendedPublicKeys.length}
          >
            <StyledIcon as={Plus} size={25} />
          </IncrementButton>
        </SelectionWrapper>
        <ContinueButton
          background={green600}
          color={white}
          onClick={() => onClick(requiredSigners)}
        >
          Confirm
        </ContinueButton>
      </SelectionContainer>
    </>
  );
};

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

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

const CurrentSelection = styled.div`
  padding: 1em;
  font-size: 2.5em;
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
