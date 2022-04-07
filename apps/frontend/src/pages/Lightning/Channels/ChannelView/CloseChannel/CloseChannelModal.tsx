import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Channel } from '@styled-icons/fluentui-system-filled';
import type { CloseStatusUpdate } from '@lily-technologies/lnrpc';

import { Select, Spinner, Unit } from 'src/components';

import { AccountMapContext, PlatformContext } from 'src/context';
import { red600 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

import { DecoratedLightningChannel, LilyLightningAccount, LilyOnchainAccount } from '@lily/types';
import { SetStateNumber } from 'src/types';
import { requireLightning } from 'src/hocs';

interface Props {
  setStep: SetStateNumber;
  channel: DecoratedLightningChannel;
  currentAccount: LilyLightningAccount;
}

const CloseChannelModal = ({ setStep, channel, currentAccount }: Props) => {
  const { accountMap } = useContext(AccountMapContext);
  const { platform } = useContext(PlatformContext);
  const [fundingAccount, setFundingAccount] = useState<LilyOnchainAccount>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const closeChannel = () => {
    setIsLoading(true);
    setError('');

    platform.closeChannel(
      {
        channelPoint: {
          fundingTxidStr: channel.channelPoint.substring(0, channel.channelPoint.indexOf(':')),
          outputIndex: Number(channel.channelPoint.substring(channel.channelPoint.indexOf(':') + 1))
        },
        deliveryAddress: fundingAccount?.addresses[0].address!,
        lndConnectUri: currentAccount.config.connectionDetails.lndConnectUri
      },
      (response: CloseStatusUpdate) => {
        if (response.closePending) {
          setIsLoading(false);
          setStep(2);
          setTimeout(() => {
            platform.getLightningData(currentAccount.config);
          }, 200);
        }
        // TODO: check for errors
      }
    );
  };

  return (
    <>
      <div>
        <StyledIconCircle className='bg-green-100 dark:bg-green-800'>
          <Channel className='text-green-600 dark:text-green-200' size={36} />
        </StyledIconCircle>
      </div>
      <TextContainer>
        <h2 className='text-gray-900 dark:text-gray-200 text-lg font-semibold'>{channel.alias}</h2>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          Are you sure you want to close this channel?
        </p>
        <div>
          <dt className='text-sm text-gray-600 dark:text-gray-400'>Closing balance</dt>
          <dd className='text-gray-900 dark:text-gray-200 text-base font-medium'>
            <Unit value={Number(channel.localBalance)} />
          </dd>

          <InputWrapper data-cy='funding-account'>
            <Select label='Send closing balance to' options={accountOptions} />
          </InputWrapper>

          {error && <ErrorText>{error}</ErrorText>}
        </div>

        <div className='flex w-full justify-end mt-6 flex-col flex-col-reverse md:flex-row'>
          <button
            type='button'
            className='justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-green-500'
            onClick={() => {
              setStep(0);
            }}
          >
            Cancel
          </button>
          <button
            type='button'
            className='justify-center mb-2 md:mb-0 ml-0 md:ml-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2  focus:ring-red-500'
            onClick={() => {
              closeChannel();
            }}
          >
            {isLoading ? (
              <>
                <Spinner /> Closing channel...
              </>
            ) : (
              'Close channel'
            )}
          </button>
        </div>
      </TextContainer>
    </>
  );
};

const InputWrapper = styled.div`
  margin-top: 1.25rem;
  width: 100%;
`;

const ErrorText = styled.div`
  color: ${red600};
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
  `)}
`;

export default requireLightning(CloseChannelModal);
