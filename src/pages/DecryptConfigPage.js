import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import { AES, enc } from 'crypto-js';

import { Button, VaultIcon } from '../components';
import { black, gray, darkOffWhite, lightGray, darkGray, lightBlue, white, red, gray400, gray500, gray600 } from '../utils/colors';


const DecryptConfigPage = ({ encryptedConfigFile, setConfigFile, setEncryptedConfigFile }) => {
  document.title = `Enter Password - Lily Wallet`;
  const [loading, setLoading] = useState(false);
  const [loadingGDrive, setLoadingGDrive] = useState(false);
  const [password, setPassword] = useState('');
  const [showCurtain, setShowCurtain] = useState(false);
  const [startCurtain, setStartCurtain] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const history = useHistory();

  const unlockFile = () => {
    // KBC-TODO: probably need error handling for wrong password
    try {
      const bytes = AES.decrypt(encryptedConfigFile.file, password);
      const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
      setLoading(true);
      // resave file with modified date
      // save password in case we need to save config again
      setTimeout(() => setShowCurtain(true), 500);
      setTimeout(() => setStartCurtain(true), 550);
      setTimeout(() => {
        setConfigFile(decryptedData);
        history.replace(`/`);
      }, 1700);
    } catch (e) {
      setPasswordError(true);
    }
  }

  const onInputEnter = (e) => {
    if (e.key === 'Enter') {
      unlockFile();
    }
  }

  const Screen = () => {
    return (
      <Wrapper>
        <MainText>
          <LilyImage src={require('../assets/flower.svg')} />
          <span>Lily Wallet</span>
        </MainText>
        <FormContainer>
          <SelectDeviceContainer>
            <DevicesWrapper>
              <VaultIcon loading={loading} />
              <TypeInPasswordText>Type in password to unlock wallet</TypeInPasswordText>
              <PasswordInput disabled type="password" value={password} />
              <UnlockButton>
                Unlock Wallet
                </UnlockButton>
            </DevicesWrapper>
          </SelectDeviceContainer>
        </FormContainer>
      </Wrapper>
    )
  }

  if (!showCurtain) {
    return (
      <Wrapper>
        <MainText>
          <LilyImage src={require('../assets/flower.svg')} />
          <span>Lily Wallet</span>
        </MainText>
        <FormContainer>
          <SelectDeviceContainer>

            <DevicesWrapper>
              <VaultIcon loading={loading} />

              <TypeInPasswordText>Type in password to unlock wallet</TypeInPasswordText>
              <PasswordInput
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => onInputEnter(e)}
                error={passwordError} />
              {passwordError && <PasswordError>Incorrect Password</PasswordError>}
              <UnlockButton
                loading={loadingGDrive ? 1 : undefined}
                onClick={() => unlockFile()}>
                Unlock Wallet
                </UnlockButton>
            </DevicesWrapper>
            <CreateNewAccountContainer>
              <CreateNewAccountButton onClick={() => history.push('login')}>
                Back to main menu
              </CreateNewAccountButton>
            </CreateNewAccountContainer>
          </SelectDeviceContainer>
        </FormContainer>
      </Wrapper>
    )
  } else {
    return (
      <CurtainContainer>
        <CurtainLeft startCurtain={startCurtain}>
          <CurtainLeftInner>
            <Screen />
          </CurtainLeftInner>

        </CurtainLeft>
        <CurtainBehind>
          <DecryptingText>Decrypting Wallet...</DecryptingText>
        </CurtainBehind>
        <CurtainRight startCurtain={startCurtain}>
          <CurtainRightInner>
            <Screen />
          </CurtainRightInner>
        </CurtainRight>
      </CurtainContainer>
    )
  }
}

const CreateNewAccountContainer = styled.div`
  padding: 1.5em;
`;

const CreateNewAccountButton = styled.div`
  cursor: pointer;
  color: ${gray500};

  &:hover {
    color: ${gray400};
  }

  &:active {
    color: ${gray600};
  }
`;

const blinking = keyframes`
  0% { opacity: .2; }
  50% { opacity: 1; }
  100% { opacity: .2; }
`;

const DecryptingText = styled.div`
  animation-name: ${blinking};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
`;

const PasswordError = styled.div`
  color: ${red};
`;

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  background: ${lightBlue};
  overflow: hidden;
`;

const MainText = styled.div`
  display: flex;
  font-size: 2em;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const LilyImage = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 12px;
`;

const TypeInPasswordText = styled.h3`
  font-size: 1.125em;
  margin-bottom: 0;
  font-weight: 100;
`;

const PasswordInput = styled.input`
  position: relative;
  border: ${p => p.error ? `1px solid ${red}` : `1px solid ${darkOffWhite}`};
  background: ${lightGray};
  padding: .75em;
  text-align: center;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: .5em;
  border-radius: 4px;
  font-size: 1.5em;
  z-index: 1;
  font-family: 'Montserrat', sans-serif;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
`;

const UnlockButton = styled.div`
  ${Button};
  margin-bottom: 1em;
  opacity: ${p => p.loading ? '0.5' : '1'};
  pointer-events: ${p => p.loading ? '0.5' : '1'};
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SelectDeviceContainer = styled.div`
  max-width: 750px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 4px;
`;

const DevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 25em;
  flex-wrap: wrap;
  background: ${white};
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 4px;
  border: 1px solid ${darkGray};
`;

const CurtainContainer = styled.div`
  display: flex;
  background: ${lightBlue};
  width: 100%;
  box-sizing: content-box;
`;

const CurtainLeft = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  flex: 1 0 50%;
  overflow: hidden;
  height: 92vh;
  
  transform: ${p => p.startCurtain ? 'translateX(-100%)' : 'translateX(0)'};
  transition: all 1s ease-out;
  z-index: 1;
`;

const CurtainLeftInner = styled.div`
  position: absolute;
  width: 100%;
  right: -25vw;
`;

const CurtainRightInner = styled.div`
  position: absolute;
  width: 100%;
  left: -25vw;
`;

const CurtainRight = styled.div`
  position: relative;
  display: flex;
  flex: 1 0 50%;
  transform: translateX(0);
  overflow: hidden;
  height: 92vh;
  transform: ${p => p.startCurtain ? 'translateX(100%)' : 'translateX(0)'};
  transition: all 1s ease-out;
  z-index: 1;
`;

const CurtainBehind = styled.div`
  align-self: flex-start;
  flex: 1;
  position: absolute;
  width: 100%;
  display: flex;
  z-index: 0;
  justify-content: center;
  align-self: center;
  flex-direction: column;
  align-items: center;
`;

export default DecryptConfigPage;