import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { GoogleDrive } from '@styled-icons/entypo-social';
import { Upload } from '@styled-icons/boxicons-regular';
import { AES } from 'crypto-js';
import { useSpring, animated } from 'react-spring';

import { BACKEND_URL } from '../config';
import { createCaravanImportFile, createColdCardBlob, downloadFile } from './Setup/utils';
import { StyledIcon } from '../components';
import { saveFileToGoogleDrive } from '../utils/google-drive';

import { Button, DeviceSelectSetup } from '../components';
import { black, darkGray, lightBlue, white, darkOffWhite, blue, gray, lightGreen, lightGray, darkGreen } from '../utils/colors';

import { getGoogleAuthenticateUrl } from '../utils/google-drive';


const Login = ({ setCaravanFile }) => {
  const [loginOption, setLoginOption] = useState(0);
  const [importedDevices, setImportedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [password, setPassword] = useState('');
  const history = useHistory();
  const springProps = useSpring({ opacity: importedDevices.length < 3 ? 0 : 1 })
  console.log('springProps: ', springProps);

  document.title = `Login - Coldcard Kitchen`;

  const getGoogleAuthenticateUrlAction = async () => {
    const url = await getGoogleAuthenticateUrl();
    window.location = url;
  }

  const importDevice = async (device, index) => {
    const { data } = await axios.post(`${BACKEND_URL}/xpub`, {
      deviceType: device.type,
      devicePath: device.path,
      path: `m/48'/1'/0'/2'` // we are assuming BIP48 P2WSH wallet
    });
    setImportedDevices([...importedDevices, { ...device, ...data }]);
    availableDevices.splice(index, 1)
    setAvailableDevices([...availableDevices]);
  }

  const exportSetupFiles = () => {
    const contentType = "text/plain;charset=utf-8;";

    const ccFile = createColdCardBlob(importedDevices);
    const caravanObject = createCaravanImportFile(importedDevices);
    const encryptedCaravanObject = AES.encrypt(JSON.stringify(caravanObject), password).toString();
    var encryptedCaravanFile = new Blob([decodeURIComponent(encodeURI(encryptedCaravanObject))], { type: contentType });

    saveFileToGoogleDrive(encryptedCaravanObject);
    setCaravanFile(caravanObject);
    downloadFile(ccFile, "coldcard_import_file.txt");
    // downloadFile(caravanFile, "caravan_import_file.json");
    history.push('/coldcard-import-instructions')
  }

  return (
    <Wrapper>
      <MainText>
        <LilyImage src={require('../assets/lily.svg')} />
        Lily Wallet
        </MainText>
      <Subtext>Lily is a self-custody Bitcoin wallet that allows you to easily store, manage, and spend Bitcoin</Subtext>
      <FormContainer>
        <LoginOptionMenu>
          <LoginOptionItem
            active={loginOption === 0}
            onClick={() => setLoginOption(0)}
          >
            <LoginOptionText>
              Load Vault
            </LoginOptionText>
          </LoginOptionItem>
          <LoginOptionItem
            active={loginOption === 1}
            onClick={() => setLoginOption(1)}
          >
            <LoginOptionText>
              Create New Vault
            </LoginOptionText>
          </LoginOptionItem>
        </LoginOptionMenu>
        <SelectDeviceContainer>
          {loginOption === 0 ? (
            <DevicesWrapper>
              <h1>Open config file</h1>
              <SignInButton
                onClick={() => { getGoogleAuthenticateUrlAction() }}>
                <StyledIcon as={GoogleDrive} size={24} style={{ marginRight: 12 }} /> Google Drive
          </SignInButton>
              <SignInButton
                background="transparent"
                color={darkGray}
                onClick={() => { getGoogleAuthenticateUrlAction() }}>
                <StyledIcon as={Upload} size={24} style={{ marginRight: 12 }} /> Local Config File
          </SignInButton>
            </DevicesWrapper>
          ) : (
              <ImportDevicesWrapper>
                <XPubHeaderWrapper>
                  <SetupHeaderWrapper>
                    {/* <SetupHeader>Connect Devices to Computer</SetupHeader> */}
                    <SetupExplainerText>
                      Connect your Coldcards to your computer, unlock them, then click to configure.
                      You may disconnect your device from your computer after it has been configured.
                </SetupExplainerText>
                  </SetupHeaderWrapper>
                  <SelectDeviceHeader><SetupSubheader>{importedDevices.length} of 3 devices configured</SetupSubheader></SelectDeviceHeader>
                </XPubHeaderWrapper>
                <XpubBodyWrapper>
                  {importedDevices.length < 3 && <DeviceSelectSetup
                    deviceAction={importDevice}
                    configuredDevices={importedDevices}
                    unconfiguredDevices={availableDevices}
                    setUnconfiguredDevices={setAvailableDevices}
                    configuredThreshold={3}
                  />}

                  {importedDevices.length === 3 && (
                    <PasswordWrapper style={springProps}>
                      <PasswordText>Almost done, just set a password to encrypt your setup file</PasswordText>
                      <PasswordInput placeholder="enter a password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                      <ExportFilesButton
                        background={darkGreen}
                        color={white}
                        active={password.length > 7}
                        onClick={() => {
                          if (password.length > 7) {
                            exportSetupFiles();
                          }
                        }}>
                        Export Setup Files
                      </ExportFilesButton>
                    </PasswordWrapper>
                  )}
                </XpubBodyWrapper>
              </ImportDevicesWrapper>
            )}
        </SelectDeviceContainer>
      </FormContainer >
    </Wrapper >
  )
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 48px;
`;

const LoginOptionMenu = styled.div`
  display: flex;
  justify-content: space-around;
`;

const LoginOptionItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.active ? lightBlue : white};
  color: ${p => p.active ? black : gray};
  padding: 1.5em;
  flex: 1;
  cursor: ${p => p.active ? 'auto' : 'pointer'};
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${darkOffWhite}`};
  border-top: ${p => p.active ? `solid 11px ${blue}` : `none`};
`;

const ImportDevicesWrapper = styled.div`
  background: ${white};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LoginOptionText = styled.div`
  font-size: 1.125em;
`;

const MainText = styled.div`
  display: flex;
  font-size: 3em;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Subtext = styled.div`
  font-size: .75em;
  color: ${darkGray};
  margin-bottom: 12px;
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  max-width: 750px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 18px;
  margin-top: 48px;
`;

const SelectDeviceContainer = styled.div`
  background: ${lightBlue};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

const SignInButton = styled(Link)`
  ${Button};
  padding: 1em;
  font-size: 1em;
  margin-top: 12px;
  font-weight: 700;
`;

const DevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 400px;
  flex-wrap: wrap;
`;

const XpubBodyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const XPubHeaderWrapper = styled.div`
  color: ${blue};
  background: ${lightBlue};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: .75em 1.5em;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${darkOffWhite};
`;

const SelectDeviceHeader = styled.h1`
  font-size: 1em;
  font-weight: 500;
`;

const SetupHeaderWrapper = styled.div`
  display: flex;
  // align-items: center;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  padding: 0 3em 0 0;
`;

const SetupHeader = styled.span`
  font-size: 1.5em;
  margin: 4px 0;
`;

const SetupSubheader = styled.span`
  font-size: 1.125em;
  color: ${darkGray};
`;

const SetupExplainerText = styled.div`
  color: ${darkGray};
  font-size: .75em;
  margin: 8px 0;
`;

const PasswordWrapper = styled(animated.div)`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
`;

const PasswordText = styled.h3``;

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: .75em;
  text-align: center;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
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
  margin-bottom: 24px;
  font-weight: 700;
  margin: 16px;
`;

export default Login;