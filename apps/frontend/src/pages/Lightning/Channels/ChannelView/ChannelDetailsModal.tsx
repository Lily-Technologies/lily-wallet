import React from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { Channel as ChannelIcon } from '@styled-icons/fluentui-system-filled';

import { Button } from 'src/components';

import { white, gray500, red600 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';
import { DecoratedLightningChannel, DecoratedPendingLightningChannel } from '@lily/types';

import { SetStateNumber } from 'src/types';

interface Props {
  channel: DecoratedLightningChannel | DecoratedPendingLightningChannel;
  setStep: SetStateNumber;
}

const ChannelDetailsModal = ({ channel, setStep }: Props) => {
  return (
    <>
      <DangerIconContainer>
        <StyledIconCircle className='bg-green-100 dark:bg-green-700'>
          <ChannelIcon className='text-green-600 dark:text-green-300 ' size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <TextContainer>
        <HeadingText className='text-gray-900 dark:text-gray-200'>{channel.alias}</HeadingText>
        <Subtext>
          Last updated {moment.unix((channel as DecoratedLightningChannel).lastUpdate).fromNow()}
        </Subtext>
        <InformationWrapper>
          <InformationArea>
            <div style={{ gridColumn: 'span 2' }}>
              <InformationLabel>Remote public key</InformationLabel>
              <InformationValue className='text-gray-900 dark:text-gray-200'>
                {(channel as DecoratedLightningChannel).remotePubkey ||
                  (channel as DecoratedPendingLightningChannel).remoteNodePub}
              </InformationValue>
            </div>
            <div>
              <InformationLabel>Total capacity</InformationLabel>
              <InformationValue className='text-gray-900 dark:text-gray-200'>
                {Number(channel.capacity).toLocaleString()} sats
              </InformationValue>
            </div>
            <div>
              <InformationLabel>Channel ID</InformationLabel>
              <InformationValue className='text-gray-900 dark:text-gray-200'>
                {(channel as DecoratedLightningChannel).chanId || 'Pending'}
              </InformationValue>
            </div>
            <div>
              <InformationLabel>Local capacity</InformationLabel>
              <InformationValue className='text-gray-900 dark:text-gray-200'>
                {Number(channel.localBalance).toLocaleString()} sats
              </InformationValue>
            </div>
            <div>
              <InformationLabel>Remote capacity</InformationLabel>
              <InformationValue className='text-gray-900 dark:text-gray-200'>
                {Number(channel.remoteBalance).toLocaleString()} sats
              </InformationValue>
            </div>
          </InformationArea>
        </InformationWrapper>

        <Buttons>
          <SaveChangesButton
            background={red600}
            color={white}
            onClick={() => {
              setStep(1);
            }}
          >
            Close channel
          </SaveChangesButton>
        </Buttons>
      </TextContainer>
    </>
  );
};

const Subtext = styled.div`
  padding-bottom: 2em;
  color: ${gray500};
`;

const InformationWrapper = styled.div`
  width: 100%;
`;

const InformationArea = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: 2rem;
  column-gap: 1rem;
`;

const InformationLabel = styled.dt`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
`;

const InformationValue = styled.dd`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-top: 0.25rem;
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${mobile(css`
    flex-direction: column;
  `)};
`;

const SaveChangesButton = styled.button`
  ${Button}
  margin-top: 1rem;

  ${mobile(css`
    margin-top: 1.25rem;
    width: 100%;
  `)};
`;

const DangerIconContainer = styled.div``;

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
  `)};
`;

const HeadingText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

export default ChannelDetailsModal;
