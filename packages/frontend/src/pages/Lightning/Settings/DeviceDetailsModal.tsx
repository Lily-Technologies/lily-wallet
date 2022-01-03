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
        <StyledIconCircle>
          <StyledIcon style={{ color: green600 }} as={Calculator} size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <TextContainer>
        <HeadingText>Device Information</HeadingText>
        <InformationContainer>
          <ImageContainer>
            <DeviceImage device={item.device} />
          </ImageContainer>
          <Rows>
            <ProfileRow>
              <ProfileKeyColumn>Device</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText>{capitalize(item.device.type)}</ProfileValueText>
              </ProfileValueColumn>
            </ProfileRow>
            <ProfileRow>
              <ProfileKeyColumn>XPub</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText>{item.xpub}</ProfileValueText>
              </ProfileValueColumn>
            </ProfileRow>
            <ProfileRow>
              <ProfileKeyColumn>Fingerprint</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText>{item.parentFingerprint}</ProfileValueText>
                <ProfileValueAction></ProfileValueAction>
              </ProfileValueColumn>
            </ProfileRow>
            <ProfileRow>
              <ProfileKeyColumn>Derivation Path</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText>{item.bip32Path}</ProfileValueText>
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
  border-top: 1px solid ${gray200};

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
  background: ${green100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeadingText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 600;
`;

export default DeviceDetailsModal;
