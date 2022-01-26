import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Channel } from '@styled-icons/fluentui-system-filled';
import type { CloseStatusUpdate } from '@lily-technologies/lnrpc';

import { Select, Button, Spinner, StyledIcon } from 'src/components';

import { AccountMapContext, PlatformContext } from 'src/context';
import {
  white,
  gray300,
  gray500,
  gray600,
  gray700,
  gray900,
  red600,
  green100,
  green600
} from 'src/utils/colors';
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
      <DangerIconContainer>
        <StyledIconCircle>
          <StyledIcon style={{ color: green600 }} as={Channel} size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <TextContainer>
        <HeadingText>{channel.alias}</HeadingText>
        <Subtext>Are you sure you want to close this channel?</Subtext>
        <SelectAccountContainer>
          <InformationLabel>Closing balance</InformationLabel>
          <InformationValue>{Number(channel.localBalance).toLocaleString()} sats</InformationValue>

          <InputWrapper data-cy='funding-account'>
            <Select label='Send closing balance to' options={accountOptions} />
          </InputWrapper>

          {error && <ErrorText>{error}</ErrorText>}
        </SelectAccountContainer>

        <Buttons>
          <CancelButton
            background={white}
            color={gray700}
            onClick={() => {
              setStep(0);
            }}
          >
            Cancel
          </CancelButton>
          <SaveChangesButton
            background={red600}
            color={white}
            onClick={() => {
              closeChannel();
            }}
          >
            {isLoading ? (
              <>
                <Spinner style={{ marginRight: '1em' }} /> Closing channel...
              </>
            ) : (
              'Close channel'
            )}
          </SaveChangesButton>
        </Buttons>
      </TextContainer>
    </>
  );
};

const Subtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;

const InputWrapper = styled.div`
  margin-top: 1.25rem;
  width: 100%;
`;

const SelectAccountContainer = styled.div``;

const InformationLabel = styled.dt`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray600};
`;

const InformationValue = styled.dd`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  margin-top: 0.25rem;
  margin-bottom: 1rem;
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${mobile(css`
    flex-direction: column;
  `)}
`;

const ErrorText = styled.div`
  color: ${red600};
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const SaveChangesButton = styled.button`
  ${Button}
  margin-top: 1rem;

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

const CancelButton = styled.button`
  ${Button}
  margin-top: 1rem;
  border: 1px solid ${gray300};
  margin-right: 0.5rem;

  ${mobile(css`
    margin-top: 1.25rem;
    margin-right: 0;
  `)}
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${green100};
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

const HeadingText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

export default requireLightning(CloseChannelModal);
