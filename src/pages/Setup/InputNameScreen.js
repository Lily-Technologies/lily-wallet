import React from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';

import { Button } from '../../components';
import { InnerWrapper, HeaderWrapper, CancelButton, PageTitleSubtext, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper } from './styles';
import { Header, HeaderLeft, HeaderRight, PageTitle } from '../../components/layout';

import { blue, white, darkOffWhite, lightBlue, black, gray } from '../../utils/colors';

const InputNameScreen = ({ setupOption, config, setStep, accountName, setAccountName }) => {
  const history = useHistory();

  return (
    <InnerWrapper>
      <HeaderWrapper>
        <Header>
          <HeaderLeft>
            <PageTitleSubtext>New Account</PageTitleSubtext>
            <PageTitle>Create new {setupOption === 2 ? 'wallet' : 'vault'}</PageTitle>
          </HeaderLeft>
          <HeaderRight>
            {config.isEmpty && <CancelButton onClick={() => { history.push('login') }}>Return to Main Menu</CancelButton>}
            {!config.isEmpty && <CancelButton onClick={() => { setStep(0) }}>Cancel</CancelButton>}
          </HeaderRight>
        </Header>
      </HeaderWrapper>
      <FormContainer>
        <BoxedWrapper>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <SetupExplainerText>
                Give your {setupOption === 2 ? 'wallet' : 'vault'} a name (i.e. "My First {setupOption === 2 ? 'Wallet' : 'Vault'}") to identify it while using Lily.
                </SetupExplainerText>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <PasswordWrapper>
            <PasswordInput
              placeholder={`${setupOption === 2 ? 'Wallet' : 'Vault'} Name`}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)} />
          </PasswordWrapper>

          <ExportFilesButton
            background={blue}
            color={white}
            active={accountName.length > 3}
            onClick={() => {
              if (accountName.length > 3) {
                setStep(2);
              }
            }}>{`Continue`}</ExportFilesButton>
        </BoxedWrapper>
      </FormContainer>
    </InnerWrapper>
  )
}

const PasswordWrapper = styled.div`
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  background: ${white};
`;

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightBlue};
  padding: .75em;
  text-align: center;
  color: ${black};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  font-size: 1.5em;
  z-index: 1;
  flex: 1;
  font-family: 'Montserrat', sans-serif;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
`;

const ExportFilesButton = styled.button`
  ${Button};
  click-events: ${p => p.active ? 'auto' : 'none'};
  opacity: ${p => p.active ? '1' : '0.5'};
  padding: 1em;
  font-size: 1em;
  font-weight: 700;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
`;

export default InputNameScreen;