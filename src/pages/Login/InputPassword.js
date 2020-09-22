import React, { useEffect, useState, useRef, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';

import { Button, Input, StyledIcon } from '../../components';

import { red, white, green500, darkGray, darkOffWhite, lightBlue, black } from '../../utils/colors';

const MIN_PASSWORD_LENGTH = 8;

// Potential input fields
const FIELD_PASSWORD = 0;
const FIELD_CONFIRMATION = 1;

const InputPasswordScreen = ({ unlockFile, config, setPassword, isLoading, encryptedConfigFile }) => {
  const [localPassword, setLocalPassword] = useState(undefined);
  const [confirmation, setConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState(undefined);
  const [confirmationError, setConfirmationError] = useState(undefined);

  const confirmationRef = useRef();
  const buttonRef = useRef();

  const validateInput = () => {
    if (localPassword && localPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return false;
    } else if (localPassword.length === 0) {
      setPasswordError(undefined);
      return true;
    } else {
      setPasswordError(false);
      return true;
    }
    if (localPassword && confirmation && localPassword !== confirmation) {
      setPasswordError('Password doesn\'t match confirmation');
      return false;
    }

    if (confirmation && localPassword !== confirmation) {
      setConfirmationError('Password & confirmation must match');
    } else if (confirmation.length === 0) {
      setConfirmationError(undefined);
    } else {
      setConfirmationError(false);
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

  return (
    <Fragment>
      <SignupOptionItem>
        <InputContainer>
          <Input
            autoFocus
            label="Password"
            value={localPassword}
            // onKeyDown={(value) => onInputEnter(value, FIELD_PASSWORD)}
            onChange={setLocalPassword}
            type="password" />
          {passwordError !== undefined && <PasswordError>{passwordError}</PasswordError>}
        </InputContainer>
        {!encryptedConfigFile && (
          <InputContainer style={{ paddingBottom: '.5em' }}>
            <Input
              ref={confirmationRef}
              label="Confirm Password"
              value={confirmation}
              // onKeyDown={(value) => onInputEnter(value, FIELD_CONFIRMATION)}
              onChange={setConfirmation}
              type="password" />
            {confirmationError !== undefined && <PasswordError>{confirmationError}</PasswordError>}
          </InputContainer>
        )}
        <SignInButton
          background={green500}
          color={white}
          onClick={() => {
            if (!encryptedConfigFile) {
              validateInput();
              if (!passwordError && !confirmationError) {
                setPassword(localPassword);
                unlockFile()
              }
            } else {
              unlockFile()
            }
          }
          }>
          {isLoading && !encryptedConfigFile ? 'Loading' : isLoading ? 'Unlocking' : encryptedConfigFile ? 'Unlock' : 'Continue'}
          {isLoading ? <LoadingImage alt="loading placeholder" src={require('../../assets/flower-loading.svg')} /> : <StyledIcon as={ArrowIosForwardOutline} size={24} />}
        </SignInButton>
        {passwordError && <PasswordError>Incorrect Password</PasswordError>}
        {encryptedConfigFile && <SignupOptionSubtext>Last accessed on {encryptedConfigFile && moment(encryptedConfigFile.modifiedTime).format('MM/DD/YYYY')}</SignupOptionSubtext>}
      </SignupOptionItem>

    </Fragment>
  )
}

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-left: .25em;
  opacity: 0.9;
`;

const SignInButton = styled.button`
  ${Button};
  padding-top: .5em;
  padding-bottom: .5em;
  font-size: 1em;
  width: 100%;
  justify-content: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  margin-bottom: .75em;
`;

const PasswordError = styled.div`
  color: ${red};
  font-size: 0.75em;
  margin-top: .5em;
`;

const SignupOptionSubtext = styled.div`
  font-size: .75em;
  margin-top: 0.75em; 
  color: ${darkGray};
  padding: 0 2em;
  line-height: 1.5em;
  white-space: normal;
`;

const SignupOptionItem = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  width: 100%;
  max-width: 22em;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  background: ${white};
`;

export default InputPasswordScreen;