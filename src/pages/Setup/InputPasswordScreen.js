import React from 'react';
import styled from 'styled-components';

import { Button } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupHeader, SetupExplainerText } from './styles';
import { white, gray, darkGreen, darkOffWhite, lightBlue, black } from '../../utils/colors';

const InputPasswordScreen = ({ header, config, password, setPassword, setStep, setupOption }) => {

  const onInputEnter = (e) => {
    if (e.key === 'Enter') {
      setStep(4);
    }
  }

  return (
    <InnerWrapper>
      {header}
      <XPubHeaderWrapper>
        <SetupHeaderWrapper>
          <div>
            <SetupHeader>Set a password</SetupHeader>
            <SetupExplainerText>
              Lily Wallet encrypts your configuration file so that other people can't track your balance and transaction information.
              Please enter a password to be used to unlock your wallet in the future.
                  </SetupExplainerText>
          </div>
        </SetupHeaderWrapper>
      </XPubHeaderWrapper>
      <PasswordWrapper>
        <PasswordInput
          autoFocus
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => onInputEnter(e)}
          type="password" />
      </PasswordWrapper>
      <ExportFilesButton
        background={darkGreen}
        color={white}
        active={password.length > 3}
        onClick={() => {
          if (password.length > 3) {
            setStep(4);
          }
        }}>{'Save Vault'}</ExportFilesButton>
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

export default InputPasswordScreen;