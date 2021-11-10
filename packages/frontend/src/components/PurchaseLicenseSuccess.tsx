import React from 'react';
import styled from 'styled-components';
import { CheckCircle } from '@styled-icons/material';

import { LicenseInformation, StyledIcon } from '.';

import { white, green500, gray700 } from 'src/utils/colors';

import { NodeConfigWithBlockchainInfo, VaultConfig } from '@lily/types';

interface Props {
  config: VaultConfig;
  nodeConfig: NodeConfigWithBlockchainInfo;
}

export const PurchaseLicenseSuccess = ({ config, nodeConfig }: Props) => {
  return (
    <Wrapper>
      <IconWrapper style={{ color: green500 }}>
        <StyledIcon as={CheckCircle} size={100} />
      </IconWrapper>
      <SuccessText>Payment Success!</SuccessText>
      <SuccessSubtext>
        Thank you so much for purchasing a license for Lily Wallet!
        <br />
        <br />
        Your payment helps fund the development and maitanance of this open source software.
      </SuccessSubtext>
      <LicenseInformation config={config} nodeConfig={nodeConfig} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${white};
  border-radius: 0.875em;
  padding: 1.5em 0.75em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const IconWrapper = styled.div``;

const SuccessText = styled.div`
  margin-top: 0.5em;
  font-size: 1.5em;
  color: ${gray700};
`;

const SuccessSubtext = styled.div`
  color: ${gray700};
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;
