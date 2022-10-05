import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { Input, Select, Spinner, UnitInput } from 'src/components';

import { LilyOnchainAccount } from '@lily/types';
import { SetStateBoolean } from 'src/types';

import { AccountMapContext } from 'src/context/AccountMapContext';

interface Props {
  openChannel: (lightningAddress: string, channelAmount: string) => {};
  setFundingAccount: React.Dispatch<React.SetStateAction<LilyOnchainAccount>>;
  isLoading: boolean;
  error: string;
  setViewOpenChannelForm: SetStateBoolean;
}

const OpenChannelForm = ({
  openChannel,
  setFundingAccount,
  isLoading,
  error,
  setViewOpenChannelForm
}: Props) => {
  const [lightningAddress, setLightningAddress] = useState('');
  const [channelAmount, setChannelAmount] = useState('');
  const { accountMap } = useContext(AccountMapContext);

  const accountOptions = Object.values(accountMap)
    .filter((account) => account.config.type === 'onchain' && !!!account.loading)
    .map((account) => {
      return {
        label: account.name,
        onClick: () => {
          if (account.config.type === 'onchain') {
            setFundingAccount(accountMap[account.config.id] as LilyOnchainAccount);
          }
        }
      };
    });

  return (
    <>
      <InputWrapper data-cy='lightning-address'>
        <Input
          label='Lightning address'
          autoFocus
          type='text'
          value={lightningAddress}
          onChange={setLightningAddress}
        />
      </InputWrapper>

      <InputWrapper data-cy='channel-amount'>
        <UnitInput
          label='Channel amount'
          inputMode='decimal'
          value={channelAmount}
          onChange={setChannelAmount}
          error={error}
        />
      </InputWrapper>

      <InputWrapper data-cy='funding-account'>
        <Select label='Funding account' options={accountOptions} />
      </InputWrapper>

      <div className='flex w-full justify-end mt-6 flex-col flex-col-reverse  md:flex-row'>
        <button
          type='button'
          className='justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-green-500'
          onClick={() => {
            setViewOpenChannelForm(false);
          }}
        >
          Cancel
        </button>
        <button
          type='button'
          className='whitespace-nowrap justify-center mb-2 md:mb-0 ml-0 md:ml-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
          onClick={() => {
            openChannel(lightningAddress, channelAmount);
          }}
        >
          {isLoading ? (
            <>
              <Spinner className='-ml-1 mr-3' /> Creating transaction...
            </>
          ) : (
            'Create funding transaction'
          )}
        </button>
      </div>
    </>
  );
};

const InputWrapper = styled.div`
  margin-top: 1.25rem;
  width: 100%;
`;

export default OpenChannelForm;
