import React, { useState, Fragment } from 'react';
import { useHistory } from "react-router-dom";
import styled, { css } from 'styled-components';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';
import { networks } from 'bitcoinjs-lib';
import moment from 'moment';
import { AES, enc } from 'crypto-js';

import { StyledIcon, FileUploader, Button, Input } from '../../components';

import { black, darkGray, white, red, gray500, gray900, green500, green600 } from '../../utils/colors';
import { bitcoinNetworkEqual } from '../../utils/transactions';
import { mobile } from '../../utils/media';
import { saveConfig } from '../../utils/files';

const Login = ({ setConfigFile, currentBitcoinNetwork, encryptedConfigFile, setEncryptedConfigFile, setPassword }) => {
  document.title = `Login - Lily Wallet`;
  const [passwordError, setPasswordError] = useState(false);
  const [localPassword, setLocalPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const unlockFile = () => {
    // KBC-TODO: probably need error handling for wrong password
    try {
      setIsLoading(true);
      const bytes = AES.decrypt(encryptedConfigFile.file, localPassword);
      const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
      setTimeout(() => {
        setConfigFile(decryptedData);
        setPassword(localPassword);
        saveConfig(decryptedData, localPassword); // we resave the file after opening to update the modifiedDate value
        setIsLoading(false);
        history.replace(`/`);
      }, 2000)
    } catch (e) {
      setPasswordError(true);
      setIsLoading(false);
    }
  }

  const onInputEnter = (e) => {
    if (e.key === 'Enter') {
      unlockFile();
    }
  }

  return (
    <PageWrapper>
      <Wrapper>
        <MainText>
          {bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ?
            <LilyLogoGray src={require('../../assets/flower.svg')} /> :
            <LilyLogo src={require('../../assets/flower.svg')} />
          }
          <TextContainer>
            <div>{encryptedConfigFile ? 'Unlock your account' : 'Welcome to Lily Wallet'}</div>
            <Subtext>
              {encryptedConfigFile ? (
                <Fragment>or <SubTextLink onClick={() => history.push('setup')}>create a new one</SubTextLink></Fragment>
              ) : (
                  "The best way to secure your bitcoin"
                )}
            </Subtext>
          </TextContainer>
        </MainText>

        <FileUploader
          accept="*"
          id="localConfigFile"
          onFileLoad={(file) => {
            setEncryptedConfigFile({ file })
          }}
        />

        <SignupOptionMenu>
          <SignupOptionItem>
            {encryptedConfigFile ? (
              <Fragment>
                <InputContainer>
                  <Input
                    label="Password"
                    onChange={setLocalPassword}
                    value={localPassword}
                    type="password"
                    error={passwordError}
                    autoFocus
                    onKeyDown={(e) => onInputEnter(e)}
                  />
                </InputContainer>


                <SignInButton background={green500} color={white} onClick={() => unlockFile()}>
                  {isLoading ? 'Unlocking' : 'Unlock'}
                  {isLoading ? <LoadingImage alt="loading placeholder" src={require('../../assets/flower-loading.svg')} /> : <StyledIcon as={ArrowIosForwardOutline} size={24} />}
                </SignInButton>
                {passwordError && <PasswordError>Incorrect Password</PasswordError>}
                <SignupOptionSubtext>Last accessed on {encryptedConfigFile && moment(encryptedConfigFile.modifiedTime).format('MM/DD/YYYY')}</SignupOptionSubtext>
              </Fragment>
            ) : (
                <Fragment>
                  <CreateAccountText>Make a new account with Lily to secure your bitcoins</CreateAccountText>
                  <CreateNewAccountButton background={green500} color={white} onClick={() => history.push('setup')}>Get Started</CreateNewAccountButton>
                </Fragment>
              )}
          </SignupOptionItem>

          <LoadFromFile>You can also restore a wallet <LabelOverlay htmlFor="localConfigFile"><SubTextLink>from a backup file</SubTextLink></LabelOverlay></LoadFromFile>
        </SignupOptionMenu>
      </Wrapper>
      <LilyImageContainer>
        <LilyImage src={require('../../assets/lily-image.jpg')} />
      </LilyImageContainer>
    </PageWrapper>
  )
}

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-left: .25em;
  opacity: 0.9;
`;

const CreateNewAccountButton = styled.button`
  ${Button};
  width: auto;
  align-items: flex-end;
  text-align: right;
  align-self: flex-end;
  margin-top: 1em;
  font-size: 0.75em;
`;

const CreateAccountText = styled.div`
  margin-bottom: 1em;
  font-size: .75em;
  text-align: left;
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

const SignInButton = styled.button`
  ${Button};
  padding-top: .5em;
  padding-bottom: .5em;
  font-size: .75em;
  width: 100%;
  justify-content: center;
`;

const LoadFromFile = styled.div`
  color: ${gray500};
  padding-top: 1em;
  font-size: .75em;
`;


const PageWrapper = styled.div`
  display: flex;
  min-height: 98vh;
  width: 100%;

  ${mobile(css`
    justify-content: center;
  `)};
`;

const LilyImage = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // width: 100%;
  height: 100%;
  object-fit: cover;
  vertical-align: middle;
  width: 100%;
`;

const LilyImageContainer = styled.div`
  position: relative;
  width: 0;
  flex: 1 1 0%;
  display: block;
  ${mobile(css`
    display: none;
  `)};
`;

const Wrapper = styled.div`
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: none;
  flex-direction: column;
  padding-top: 48px;
  padding: 5em;
  justify-content: center;
  position: relative;
`;

const MainText = styled.div`
  display: flex;
  font-size: 2em;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  font-weight: 600;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: center;
  margin-top: .5em;
`;

const Subtext = styled.div`
  font-size: .5em;
  color: ${darkGray};
  // margin-bottom: .75em;
  font-weight: 500;
  margin-top: .5em;
`;

const SubTextLink = styled.span`
  color: ${green600};

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const LilyLogo = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 12px;
`;

const LilyLogoGray = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 12px;
  filter: grayscale(100%);
`;

const LabelOverlay = styled.label`
  width: 100%;
`;

const SignupOptionMenu = styled.div`
  width: 100%;
  padding-top: 1.75em;
  flex-direction: column;
  display: flex;
`;

const SignupOptionSubtext = styled.div`
  font-size: .5em;
  margin-top: 0.75em;
  color: ${darkGray};
  padding: 0 5em;
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
  font-size: 1.5em;
  // min-height: 12em;
  background: ${white};
`;

export default Login;