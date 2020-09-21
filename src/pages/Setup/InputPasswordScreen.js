import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import { Button, Input } from '../../components';
import { InnerWrapper, FormContainer, BoxedWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupHeader, SetupExplainerText } from './styles';
import { red, white, gray, darkGreen, darkOffWhite, lightBlue, black } from '../../utils/colors';

const MIN_PASSWORD_LENGTH = 8;

// Potential input fields
const FIELD_PASSWORD = 0;
const FIELD_CONFIRMATION = 1;

const InputPasswordScreen = ({ header, config, setSetupPassword, setStep }) => {
  const [localPassword, setLocalPassword] = useState(undefined);
  const [confirmation, setConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState(undefined);
  const [confirmationError, setConfirmationError] = useState(undefined);

  const confirmationRef = useRef();
  const buttonRef = useRef();

  const validateInput = (value, which) => {
    switch (which) {
      case FIELD_PASSWORD:
        const newPassword = value;
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
        setLocalPassword(newPassword);
        break;
      case FIELD_CONFIRMATION:
        const _confirmation = value;
        if (_confirmation && localPassword !== _confirmation) {
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
      <FormContainer>
        <BoxedWrapper>

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
            <Input
              autoFocus
              label="Password"
              value={localPassword}
              onKeyDown={(value) => onInputEnter(value, FIELD_PASSWORD)}
              onChange={(value) => validateInput(value, FIELD_PASSWORD)}
              type="password" />
            {passwordError !== undefined && <PasswordError>{passwordError}</PasswordError>}
          </PasswordWrapper>
          <PasswordWrapper style={{ paddingBottom: '1.5em' }}>
            <Input
              ref={confirmationRef}
              label="Confirm Password"
              value={confirmation}
              onKeyDown={(value) => onInputEnter(value, FIELD_CONFIRMATION)}
              onChange={(value) => validateInput(value, FIELD_CONFIRMATION)}
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
                setSetupPassword(localPassword);
                setStep(4);
              }
            }}>{'Save Vault'}</ExportFilesButton>
        </BoxedWrapper>
      </FormContainer>
    </InnerWrapper>
  )
}

const PasswordWrapper = styled.div`
  padding: 1.5em 1.5em 0;
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
  margin-top: 1em;
`;

export default InputPasswordScreen;