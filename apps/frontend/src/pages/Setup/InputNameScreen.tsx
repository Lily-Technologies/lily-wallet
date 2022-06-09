import React, { useState } from 'react';
import styled from 'styled-components';
import { Transition } from '@headlessui/react';

import { Button, Input } from 'src/components';

import PageHeader from './PageHeader';
import StepGroups from './Steps';

import {
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  SetupExplainerText,
  FormContainer,
  BoxedWrapper,
  SetupHeader
} from './styles';

import { white, green600 } from 'src/utils/colors';
import { capitalize as capitalizeFunc } from 'src/utils/other';

import { OnChainConfigWithoutId, LightningConfig } from '@lily/types';

interface Props {
  setupOption: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setNewAccountName: (accountName: string) => void;
  newAccount: OnChainConfigWithoutId | LightningConfig;
}

const InputNameScreen = ({ setupOption, setStep, newAccount, setNewAccountName }: Props) => {
  const [localAccountName, setLocalAccountName] = useState(newAccount.name);
  const [nameError, setNameError] = useState('');

  const nextScreenAction = () => {
    if (localAccountName.length > 3) {
      setNewAccountName(localAccountName);
      setStep(2);
    } else {
      setNameError('Not enough characters');
    }
  };

  const onInputEnter = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      nextScreenAction();
    }
  };

  const getAccountType = (setupOption: number, capitalize?: 'all' | 'first' | 'none') => {
    let option;
    if (setupOption === 1) {
      option = 'vault';
    } else if (setupOption === 2) {
      option = 'wallet';
    } else if (setupOption === 3) {
      option = 'hardware wallet';
    } else {
      option = 'lightning wallet';
    }

    if (capitalize === 'all') {
      const splitOption = option.toLowerCase().split(' ');
      for (var i = 0; i < splitOption.length; i++) {
        splitOption[i] = capitalizeFunc(splitOption[i]);
      }
      // Directly return the joined string
      return splitOption.join(' ');
    } else if (capitalize === 'first') {
      return capitalizeFunc(option);
    } else {
      return option;
    }
  };

  return (
    <div className='w-full justify-center text-gray-900 dark:text-gray-200 overflow-x-hidden px-1'>
      <PageHeader
        headerText={`Create new ${getAccountType(setupOption, 'all')}`}
        setStep={setStep}
        showCancel={true}
      />
      <FormContainer>
        <BoxedWrapper>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Enter a name</SetupHeader>
                <SetupExplainerText>
                  Give your {getAccountType(setupOption)} a name (i.e. "My First{' '}
                  {getAccountType(setupOption, 'all')}") to identify it while using Lily.
                </SetupExplainerText>
              </div>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <div className='flex flex-col py-4 px-3 bg-whtie dark:bg-gray-800'>
            <Input
              // autoFocus
              error={nameError}
              label='Account Name'
              type='text'
              placeholder={`${getAccountType(setupOption, 'all')} Name`}
              value={localAccountName}
              onChange={setLocalAccountName}
              onKeyDown={(e) => onInputEnter(e)}
            />
          </div>

          <ExportFilesButton
            background={green600}
            color={white}
            // active={accountName.length > 3}
            onClick={() => nextScreenAction()}
          >{`Continue`}</ExportFilesButton>
        </BoxedWrapper>
      </FormContainer>
    </div>
  );
};

const ExportFilesButton = styled.button`
  ${Button};
  padding: 1em;
  font-size: 1em;
  font-weight: 700;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
`;

export default InputNameScreen;
