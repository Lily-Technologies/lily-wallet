import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { LockAlt } from '@styled-icons/boxicons-regular';

import { StyledIcon, Input, Button, ModalContentWrapper } from 'src/components';

import { mobile } from 'src/utils/media';
import { red500, white, yellow100, yellow400, gray500, green700 } from 'src/utils/colors';

const MIN_PASSWORD_LENGTH = 8;

interface Props {
  downloadEncryptedCurrentConfig: (password: string) => void;
  downloadUnencryptedCurrentConfig: () => void;
}

export const PasswordModal = ({
  downloadEncryptedCurrentConfig,
  downloadUnencryptedCurrentConfig
}: Props) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationError, setConfirmationError] = useState<string | undefined>(undefined);

  const validateInput = () => {
    if (password && password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return false;
    } else if (password && confirmPassword && password !== confirmPassword) {
      setConfirmationError("Password doesn't match confirmation");
      return false;
    } else {
      setPasswordError(undefined);
      setConfirmationError(undefined);
      return true;
    }
  };

  return (
    <ModalContentWrapper>
      <DangerIconContainer>
        <StyledIconCircle onDoubleClick={() => downloadUnencryptedCurrentConfig()}>
          <StyledIcon style={{ color: yellow400 }} as={LockAlt} size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <DangerTextContainer>
        <span className='text-xl font-medium text-gray-900 dark:text-gray-100'>
          Secure your backup with a password
        </span>
        <ModalSubtext>Give a password to encrypt your backup with.</ModalSubtext>
        <div className='w-full grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-x-8'>
          <div className='flex flex-col'>
            <Input label='Password' value={password} onChange={setPassword} type='password' />
            {passwordError !== undefined && <PasswordError>{passwordError}</PasswordError>}
          </div>
          <div className='flex flex-col'>
            <Input
              labelClassNames='mt-4 lg:mt-0'
              label='Confirm Password'
              value={confirmPassword}
              onChange={setConfirmPassword}
              type='password'
            />
          </div>
          {confirmationError !== undefined && <PasswordError>{confirmationError}</PasswordError>}
        </div>
        <Buttons>
          <DownloadButton
            background={green700}
            color={white}
            onClick={() => {
              if (validateInput()) {
                downloadEncryptedCurrentConfig(password);
              }
            }}
          >
            Download Backup
          </DownloadButton>
        </Buttons>
      </DangerTextContainer>
    </ModalContentWrapper>
  );
};

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1.5em 0 0;
  width: 100%;
`;

const DownloadButton = styled.button`
  ${Button}
`;

const DangerTextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
  `)};
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${yellow100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalSubtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const PasswordError = styled.div`
  color: ${red500};
  font-size: 0.75em;
  margin-top: 0.5em;
`;
