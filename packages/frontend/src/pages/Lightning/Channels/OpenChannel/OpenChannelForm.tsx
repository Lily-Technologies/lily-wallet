import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';

import { Button, Input, Select, Spinner } from 'src/components';

import { white, gray300, gray700, green600 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

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
        <Input
          label='Channel amount'
          type='text'
          value={channelAmount}
          onChange={setChannelAmount}
          error={error}
        />
      </InputWrapper>

      <InputWrapper data-cy='funding-account'>
        <Select label='Funding account' options={accountOptions} />
      </InputWrapper>

      <Buttons>
        <CancelButton
          background={white}
          color={gray700}
          onClick={() => {
            setViewOpenChannelForm(false);
          }}
        >
          Cancel
        </CancelButton>
        <SaveChangesButton
          background={green600}
          color={white}
          onClick={() => {
            openChannel(lightningAddress, channelAmount);
          }}
        >
          {isLoading ? (
            <>
              <Spinner style={{ marginRight: '1em' }} /> Creating transaction...
            </>
          ) : (
            'Create funding transaction'
          )}
        </SaveChangesButton>
      </Buttons>
    </>
  );
};

const InputWrapper = styled.div`
  margin-top: 1.25rem;
  width: 100%;
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;

  ${mobile(css`
    flex-direction: column;
  `)};
`;

const SaveChangesButton = styled.button`
  ${Button}

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

const CancelButton = styled.button`
  ${Button}
  border: 1px solid ${gray300};
  margin-right: 1em;

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

export default OpenChannelForm;
