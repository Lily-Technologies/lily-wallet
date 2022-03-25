import React from 'react';

import { HeaderWrapper, PageTitleSubtext } from './styles';
import { Header, HeaderLeft, Dropdown } from 'src/components/';

import { SetStateNumber } from 'src/types';

interface Props {
  headerText: string;
  setStep: SetStateNumber;
  step: number;
  setSetupOption: SetStateNumber;
}

const PageHeader = ({ headerText, setStep, step, setSetupOption }: Props) => {
  return (
    <HeaderWrapper>
      <Header>
        <HeaderLeft>
          <PageTitleSubtext>New Account</PageTitleSubtext>
          <h1 className='text-gray-900 dark:text-gray-200 font-medium text-3xl'>{headerText}</h1>
        </HeaderLeft>
        <div className='flex'>
          {step === 0 && (
            <Dropdown
              data-cy='Select account dropdown'
              minimal={true}
              className='text-black dark:text-white'
              dropdownItems={[
                {
                  label: 'New Software Wallet',
                  onClick: () => {
                    setSetupOption(2);
                    setStep(1);
                  }
                }
              ]}
            />
          )}

          {step > 0 && (
            <button
              type='button'
              className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2  focus:ring-green-500'
              onClick={() => {
                setStep(0);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </Header>
    </HeaderWrapper>
  );
};

export default PageHeader;