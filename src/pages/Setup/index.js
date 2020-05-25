import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { AES } from 'crypto-js';

import { BACKEND_URL } from '../../config';
import { saveFileToGoogleDrive } from '../../utils/google-drive';
import { createConfigFile, createColdCardBlob, downloadFile } from '../../utils/files';
import { Button, DeviceSelectSetup } from '../../components';
import { black, gray, blue, white, darkGreen, offWhite, darkGray, darkOffWhite, lightGray, lightBlue } from '../../utils/colors';

import CreateWallet from './CreateWallet';

const Setup = ({ config, setConfigFile, currentBitcoinNetwork }) => {
  const [setupOption, setSetupOption] = useState(0);
  const [importedDevices, setImportedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [password, setPassword] = useState('');
  const [createWallet, setCreateWallet] = useState(true);
  const history = useHistory();

  document.title = `Create Files - Lily Wallet`;

  const importDevice = async (device, index) => {
    const { data } = await axios.post(`${BACKEND_URL}/xpub`, {
      deviceType: device.type,
      devicePath: device.path,
      path: `m/48'/0'/0'/2'` // we are assuming BIP48 P2WSH wallet
    });
    setImportedDevices([...importedDevices, { ...device, ...data }]);
    availableDevices.splice(index, 1);
    console.log('importedDevices: ', importedDevices);
    setAvailableDevices([...availableDevices]);
  }

  const exportSetupFiles = () => {
    const contentType = "text/plain;charset=utf-8;";

    const ccFile = createColdCardBlob(importedDevices);
    const configObject = createConfigFile(importedDevices, currentBitcoinNetwork);
    const encryptedCaravanObject = AES.encrypt(JSON.stringify(configObject), password).toString();
    var encryptedCaravanFile = new Blob([decodeURIComponent(encodeURI(encryptedCaravanObject))], { type: contentType });

    saveFileToGoogleDrive(encryptedCaravanObject);
    setConfigFile(configObject);
    downloadFile(ccFile, "coldcard_import_file.txt");
    // downloadFile(caravanFile, "caravan_import_file.json");
    history.push('/coldcard-import-instructions')
  }

  return (
    <Wrapper>
      <FormContainer>
        <SelectDeviceContainer>
          <LoginOptionMenu>
            <LoginOptionItem
              active={!!!createWallet}
              onClick={() => setCreateWallet(false)}
              borderRight={true}
            >
              <LoginOptionText>
                New Vault
            </LoginOptionText>
            </LoginOptionItem>
            <LoginOptionItem
              active={!!createWallet}
              onClick={() => setCreateWallet(true)}
              borderLeft={true}
            >
              <LoginOptionText>
                New Wallet
            </LoginOptionText>
            </LoginOptionItem>
          </LoginOptionMenu>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <SetupHeader>Connect Devices to Computer</SetupHeader>
              <SetupExplainerText>
                Connect and unlock devices in order to create your multisig wallet for Coldcard and Caravan.
                You may disconnect your device from your computer after it has been configured.
              </SetupExplainerText>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <SetupHeaderContainer>

          </SetupHeaderContainer>

          {createWallet ? (
            <CreateWallet
              config={config}
              setConfigFile={setConfigFile}
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
          ) : (
              <DeviceSelectSetup
                deviceAction={importDevice}
                configuredDevices={importedDevices}
                unconfiguredDevices={availableDevices}
                setUnconfiguredDevices={setAvailableDevices}
                configuredThreshold={3}
              />
            )}

          {importedDevices.length === 3 && (
            <PasswordWrapper>
              <PasswordText>Almost done, just set a password to encrypt your setup file:</PasswordText>
              <PasswordInput placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </PasswordWrapper>
          )}
          {importedDevices.length === 3 && <ExportFilesButton
            background={darkGreen}
            color={white}
            active={password.length > 7}
            onClick={() => {
              if (password.length > 7) {
                exportSetupFiles();
              }
            }}>{'Export Setup Files'}</ExportFilesButton>}
        </SelectDeviceContainer>
      </FormContainer>
    </Wrapper>
  )
}

const ConfigWallet = styled.div`
  ${Button}
`;

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  // margin-top: -1px;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding-top: 50px;
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
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
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${gray}`};
  border-left: ${p => p.active && p.borderLeft ? `solid 1px ${gray}` : 'none'};
  border-right: ${p => p.active && p.borderRight ? `solid 1px ${gray}` : 'none'};
  border-top: ${p => p.active ? `solid 11px ${blue}` : `none`};
`;

const LoginOptionText = styled.div`
  font-size: 1.125em;
`;

const SelectDeviceContainer = styled.div`
  max-width: 750px;
  background: #fff;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 18px;
  border: 1px solid ${darkGray};
`;

const XPubHeaderWrapper = styled.div`
  color: ${blue};
  background: ${offWhite};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 24px 24px 12px;
  // border-top: 12px solid ${blue};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${gray};
`;

const SetupHeaderContainer = styled.div`
  padding: .75em;
`;

const SelectDeviceHeader = styled.h1`
  font-size: 1em;
  font-weight: 500;
`;

const BackToMainMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  &:visited {
    color: ${blue};
  }
`;

const SetupHeaderWrapper = styled.div`
  display: flex;
  // align-items: center;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  padding: 0 48px 0 0;
`;

const SetupHeader = styled.span`
  font-size: 1.5em;
  margin: 4px 0;
`;

const SetupSubheader = styled.span`
  font-size: 1.1em;
  color: ${darkGray};
`;

const SetupExplainerText = styled.div`
  color: ${darkGray};
  font-size: .8em;
  margin: 8px 0;
`;

const PasswordWrapper = styled.div`
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
  padding: 16px;
  font-size: 1em;
  margin-top: 12px;
  font-weight: 700;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export default Setup;