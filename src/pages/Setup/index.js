import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { AES } from 'crypto-js';

import { BACKEND_URL } from '../../config';
import { saveFileToGoogleDrive } from '../../utils/google-drive';
import { createCaravanImportFile, createColdCardBlob, downloadFile } from './utils';
import { Button, DeviceSelect } from '../../components';
import { black, gray, blue, white, darkGreen, offWhite, darkGray, darkOffWhite, lightGray } from '../../utils/colors';

const Setup = ({ setCaravanFile }) => {
  const [importedDevices, setImportedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [password, setPassword] = useState('');
  const history = useHistory();

  document.title = `Create Files - Coldcard Kitchen`;

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
      <FormContainer>
        <SelectDeviceContainer>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <SetupHeader>Connect Devices to Computer</SetupHeader>
              <SetupExplainerText>
                Connect and unlock devices in order to create your multisig wallet for Coldcard and Caravan.
                You may disconnect your device from your computer after it has been configured.
              </SetupExplainerText>
            </SetupHeaderWrapper>
            <SelectDeviceHeader><SetupSubheader>{importedDevices.length} of 3 devices configured</SetupSubheader></SelectDeviceHeader>
          </XPubHeaderWrapper>
          <SetupHeaderContainer>

          </SetupHeaderContainer>

          <DeviceSelect
            deviceAction={importDevice}
            configuredDevices={importedDevices}
            unconfiguredDevices={availableDevices}
            setUnconfiguredDevices={setAvailableDevices}
            configuredThreshold={3}
          />

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
`;

const XPubHeaderWrapper = styled.div`
  color: ${blue};
  background: ${offWhite};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-top: 12px solid ${blue};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${gray};
`;

const SetupHeaderContainer = styled.div`
  padding: 12px;
`;

const SelectDeviceHeader = styled.h1`
  font-size: 16px;
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
  font-size: 24px;
  margin: 4px 0;
`;

const SetupSubheader = styled.span`
  font-size: 18px;
  color: ${darkGray};
`;

const SetupExplainerText = styled.div`
  color: ${darkGray};
  font-size: 12px;
  margin: 12px 0;
`;

const PasswordWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const PasswordText = styled.h3``;

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 12px;
  text-align: center;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
  border-radius: 4px;
  font-size: 24px;
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
  font-size: 16px;
  margin-top: 12px;
  font-weight: 700;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export default Setup;