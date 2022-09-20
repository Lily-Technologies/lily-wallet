import React from 'react';
import styled from 'styled-components';
import { ExclamationIcon } from '@heroicons/react/outline';

import { StyledIcon, ModalContentWrapper, Button } from '.';

import { white, red100, red600, gray500 } from 'src/utils/colors';

interface Props {
  message: string;
  closeModal: () => void;
}

export const ErrorModal = ({ message, closeModal }: Props) => (
  <ModifiedModalContentWrapper>
    <DangerIconContainer>
      <div className='flex items-center justify-center rounded-full bg-red-100 dark:bg-red-800 w-12 h-12'>
        <ExclamationIcon className='w-9 h-9 text-red-500 dark:text-red-200' />
      </div>
    </DangerIconContainer>
    <DangerTextContainer>
      <h3 className='text-gray-900 dark:text-white font-medium text-2xl'>Error</h3>
      <p className='text-center text-gray-500 dark:text-gray-300 mt-2'>{message}</p>
      <DismissButton color={white} background={red600} onClick={() => closeModal()}>
        Dismiss
      </DismissButton>
    </DangerTextContainer>
  </ModifiedModalContentWrapper>
);

const DismissButton = styled.button`
  ${Button}
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 100%;
  margin-top: 1.25rem;
`;

const ModifiedModalContentWrapper = styled(ModalContentWrapper)`
  flex-direction: column;
  align-items: center;
  margin-top: 1.25rem;
  max-width: ;
`;

const DangerTextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  margin-top: 0.75rem;
  width: 100%;
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${red100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DangerText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

const DangerSubtext = styled.div`
  margin-top: 0.5rem;
  color: ${gray500};
  text-align: center;
`;
