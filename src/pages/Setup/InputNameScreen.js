import React from 'react';
import styled from 'styled-components';

import { Button } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';

import { white, darkOffWhite, lightBlue, black, gray } from '../../utils/colors';


const InputNameScreen = ({ header, setupOption, setStep, accountName, setAccountName }) => {

  const nextScreenAction = () => {
    if (accountName.length > 3) {
      setStep(2);
    }
  }

  const onInputEnter = (e) => {
    if (e.key === 'Enter') {
      nextScreenAction();
    }
  }

  return (
    <InnerWrapper>
      {header}
      <FormContainer>
        <BoxedWrapper>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Enter a name</SetupHeader>
                <SetupExplainerText>
                  Give your {setupOption === 2 ? 'wallet' : 'vault'} a name (i.e. "My First {setupOption === 2 ? 'Wallet' : 'Vault'}") to identify it while using Lily.
                </SetupExplainerText>
              </div>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <PasswordWrapper>
            <NameInput
              autoFocus
              placeholder={`${setupOption === 2 ? 'Wallet' : 'Vault'} Name`}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              onKeyDown={(e) => onInputEnter(e)}
            />
          </PasswordWrapper>

          <ExportFilesButton
            active={accountName.length > 3}
            onClick={() => nextScreenAction()}>{`Continue`}</ExportFilesButton>
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

const NameInput = styled.input`
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