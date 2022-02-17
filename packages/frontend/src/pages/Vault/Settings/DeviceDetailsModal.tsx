import React from 'react';
import styled, { css } from 'styled-components';
import { Calculator } from '@styled-icons/heroicons-outline';

import { StyledIcon, DeviceImage } from 'src/components';

import { mobile } from 'src/utils/media';
import { capitalize } from 'src/utils/other';
import { green100, gray200, gray500, gray900, green600 } from 'src/utils/colors';

import { ExtendedPublicKey } from '@lily/types';

interface Props {
  item: ExtendedPublicKey;
}

const DeviceDetailsModal = ({ item }: Props) => {
  return (
    <ModalContentWrapper>
      <DangerIconContainer>
        <StyledIconCircle className='bg-green-100 dark:bg-green-800'>
          <Calculator className='text-green-600 dark:text-green-200' size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <TextContainer>
        <HeadingText className='text-gray-900 dark:text-gray-200'>Device Information</HeadingText>
        <Subtext>
          This information is derived from data inputted when setting up this account.
        </Subtext>
        <InformationContainer>
          <ImageContainer>
            <DeviceImage device={item.device} />
          </ImageContainer>
          <Rows>
            <ProfileRow className='border-b border-gray-200 dark:border-gray-700'>
              <ProfileKeyColumn>Device</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText className='text-gray-900 dark:text-gray-200'>
                  {capitalize(item.device.type)}
                </ProfileValueText>
              </ProfileValueColumn>
            </ProfileRow>
            <ProfileRow className='border-b border-gray-200 dark:border-gray-700'>
              <ProfileKeyColumn>XPub</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText className='text-gray-900 dark:text-gray-200'>
                  {item.xpub}
                </ProfileValueText>
              </ProfileValueColumn>
            </ProfileRow>
            <ProfileRow className='border-b border-gray-200 dark:border-gray-700'>
              <ProfileKeyColumn>Fingerprint</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText className='text-gray-900 dark:text-gray-200'>
                  {item.parentFingerprint}
                </ProfileValueText>
                <ProfileValueAction></ProfileValueAction>
              </ProfileValueColumn>
            </ProfileRow>
            <ProfileRow className='border-b border-gray-200 dark:border-gray-700'>
              <ProfileKeyColumn>Derivation Path</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText className='text-gray-900 dark:text-gray-200'>
                  {item.bip32Path}
                </ProfileValueText>
                <ProfileValueAction></ProfileValueAction>
              </ProfileValueColumn>
            </ProfileRow>
          </Rows>
        </InformationContainer>
      </TextContainer>
    </ModalContentWrapper>
  );
};

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
  padding: 1.5em;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};
`;

const ImageContainer = styled.div`
  margin-right: 3em;
`;

const InformationContainer = styled.div`
  display: flex;
  padding: 1em;
  align-items: center;
  overflow: auto;
  width: 100%;
`;

const Subtext = styled.div`
  padding-bottom: 2em;
  color: ${gray500};
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;

  ${mobile(css`
    display: block;
  `)}
`;

const ProfileKeyColumn = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 600;
  align-items: center;
  display: flex;
`;

const ProfileValueColumn = styled.div`
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
  overflow: auto;
`;

const ProfileValueText = styled.span`
  flex: 1;
`;

const ProfileValueAction = styled.span`
  margin-left: 1rem;
  display: flex;
`;

const TextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;
  width: 100%;
  overflow: auto;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
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

const HeadingText = styled.h3`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 600;
`;

export default DeviceDetailsModal;
