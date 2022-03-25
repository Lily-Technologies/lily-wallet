import React from 'react';
import styled from 'styled-components';
import { Bank } from '@styled-icons/remix-line';
import { Calculator } from '@styled-icons/heroicons-outline';
import { Bolt } from '@styled-icons/open-iconic';

import { InnerWrapper } from './styles';
import { green700 } from 'src/utils/colors';

interface Props {
  header: JSX.Element;
  setSetupOption: React.Dispatch<React.SetStateAction<number>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const SelectAccountScreen = ({ header, setSetupOption, setStep }: Props) => {
  return (
    <InnerWrapper>
      {header}
      <div className='flex flex-col space-y-4'>
        <button
          className='flex items-center py-6 rounded shadow px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-300 dark:border-gray-700 border-t-8'
          style={{ borderTopColor: green700 }}
          onClick={() => {
            setSetupOption(3);
            setStep(1);
          }}
        >
          <div className='flex shrink-0 items-center h-10 w-10'>
            <Calculator />
          </div>
          <SignupOptionTextContainer>
            <h3 className='text-xl leading-6 font-medium text-gray-900 dark:text-gray-200'>
              Hardware Wallet
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Import your hardware wallet to send, receive, and manage your bitcoin
            </p>
          </SignupOptionTextContainer>
        </button>

        <button
          className='flex items-center py-6 rounded shadow px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-300 dark:border-gray-700'
          onClick={() => {
            setSetupOption(1);
            setStep(1);
          }}
        >
          <div className='flex shrink-0 items-center h-10 w-10'>
            <Bank />
          </div>
          <SignupOptionTextContainer>
            <h3 className='text-xl leading-6 font-medium text-gray-900 dark:text-gray-200'>
              Multisignature Vault
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Combine multiple hardware wallets to create a vault for securing larger amounts of
              bitcoin
            </p>
          </SignupOptionTextContainer>
        </button>

        <button
          className='flex items-center py-6 rounded shadow px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-300 dark:border-gray-700'
          onClick={() => {
            setSetupOption(4);
            setStep(1);
          }}
        >
          <div className='flex shrink-0 items-center h-10 w-10'>
            <Bolt />
          </div>
          <SignupOptionTextContainer>
            <h3 className='text-xl leading-6 font-medium text-gray-900 dark:text-gray-200'>
              Lightning Wallet
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Connect to your lightning wallet to manage channels and send payments
            </p>
          </SignupOptionTextContainer>
        </button>
      </div>
    </InnerWrapper>
  );
};

const SignupOptionTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 1em;
`;

export default SelectAccountScreen;
