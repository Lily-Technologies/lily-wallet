import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import { Button } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupHeader, SetupExplainerText } from './styles';
import { red, white, gray, darkGreen, darkOffWhite, lightBlue, black } from '../../utils/colors';

const MIN_PASSWORD_LENGTH = 8;

// Potential input fields
const FIELD_PASSWORD = 0;
const FIELD_CONFIRMATION = 1;

const InputPasswordScreen = ({ header, config, password, setPassword, setStep, setupOption }) => {

  const [confirmation, setConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState(undefined);
  const [confirmationError, setConfirmationError] = useState(undefined);

  const confirmationRef = useRef();
  const buttonRef = useRef();

  const validateInput = (event, which) => {
    switch (which) {
      case FIELD_PASSWORD:
        const newPassword = event.target.value;
        if (newPassword && newPassword.length < MIN_PASSWORD_LENGTH) {
          setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
        } else if (newPassword.length === 0) {
          setPasswordError(undefined);
        } else {
          setPasswordError(false);
        }
        if (newPassword && confirmation && newPassword !== confirmation) {
          setPasswordError('Password doesn\' match confirmation');
        }
        setPassword(newPassword);
        break;
      case FIELD_CONFIRMATION:
        const _confirmation = event.target.value;
        if (_confirmation && password !== _confirmation) {
          setConfirmationError('Password & confirmation must match');
        } else if (_confirmation.length === 0) {
          setConfirmationError(undefined);
        } else {
          setConfirmationError(false);
        }
        setConfirmation(_confirmation);
        break;
    }
  }

  const onInputEnter = (event, field) => {
    if (event.key === 'Enter') {
      switch (field) {
        case FIELD_PASSWORD:
          confirmationRef.current.focus();
          break;
        case FIELD_CONFIRMATION:
          buttonRef.current.focus();
          break;
      }
      event.preventDefault();
    }
  }

  useEffect(() => { // don't ask for password again if config isn't empty, use old password
    if (!config.isEmpty) {
      setStep(4)
    }
  })

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
          onKeyDown={(e) => onInputEnter(e, FIELD_PASSWORD)}
          onChange={(e) => validateInput(e, FIELD_PASSWORD)}
          type="password" />
        {passwordError !== undefined && <PasswordError>{passwordError}</PasswordError>}
      </PasswordWrapper>
      <PasswordWrapper>
        <PasswordInput
          ref={confirmationRef}
          placeholder="confirmation"
          value={confirmation}
          onKeyDown={(e) => onInputEnter(e, FIELD_CONFIRMATION)}
          onChange={(e) => validateInput(e, FIELD_CONFIRMATION)}
          type="password" />
        {confirmationError !== undefined && <PasswordError>{confirmationError}</PasswordError>}
      </PasswordWrapper>
      <ExportFilesButton
        ref={buttonRef}
        background={darkGreen}
        color={white}
        active={!(passwordError !== false || confirmationError !== false)}
        onClick={() => {
          if (!(passwordError !== false || confirmationError !== false)) {
            setPassword(password);
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

const PasswordError = styled.div`
  font-size: 0.5em;
  color: ${red};
  text-align: right;
`;

export default InputPasswordScreen;