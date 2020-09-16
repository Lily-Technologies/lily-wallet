import React from 'react';
import styled from 'styled-components';
import { Bank } from '@styled-icons/remix-line';
import { Wallet } from '@styled-icons/ionicons-outline';

import { StyledIcon } from '../../components';
import { InnerWrapper } from './styles';
import { GridArea } from '../../components/layout';
import { blue500, darkGray, white, gray, offWhite } from '../../utils/colors';

const SelectAccountScreen = ({ header, setSetupOption, setStep }) => {

  return (
    <InnerWrapper>
      {header}
      <SignupOptionMenu>
        <SignupOptionItem
          onClick={() => {
            setSetupOption(2);
            setStep(1);
          }}>
          <StyledIcon as={Wallet} size={48} style={{ marginBottom: '0.5em' }} />
          <SignupOptionMainText>Wallet</SignupOptionMainText>
          <SignupOptionSubtext>Create a new Bitcoin wallet or connect an existing hardware wallet</SignupOptionSubtext>
        </SignupOptionItem>

        <SignupOptionItem style={{ borderTop: `8px solid ${blue500}` }} onClick={() => { setSetupOption(1); setStep(1); }}>
          <StyledIcon as={Bank} size={48} style={{ marginBottom: '0.5em' }} />
          <SignupOptionMainText>Vault</SignupOptionMainText>
          <SignupOptionSubtext>Use hardware wallets to create a vault for securing larger amounts of Bitcoin</SignupOptionSubtext>
        </SignupOptionItem>
      </SignupOptionMenu>
    </InnerWrapper>
  )
}

const SignupOptionMenu = styled(GridArea)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  max-width: 46.875em;
  width: 100%;
  padding: 1.5em 0;
`;

const SignupOptionMainText = styled.div`
  font-size: 1em;
`;

const SignupOptionSubtext = styled.div`
  font-size: .5em;
  margin-top: 0.5em;
  color: ${darkGray};
  padding: 0 3em;
`;

const SignupOptionItem = styled.div`
  background: ${white};
  border: 1px solid ${gray};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  border-radius: 4px;
  min-height: 200px;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  text-align: center;

  &:hover {
                background: ${offWhite};
    cursor: pointer;
  }
`;

export default SelectAccountScreen