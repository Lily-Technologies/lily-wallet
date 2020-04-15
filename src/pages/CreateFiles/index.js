import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';

import { BACKEND_URL } from '../../config';
import { createCaravanImportFile, createColdCardBlob, downloadFile } from './utils';
import { Button, DeviceSelect } from '../../components';
import { black, gray, blue, white, green, offWhite, darkOffWhite } from '../../utils/colors';

const CreateFiles = () => {
  const [importedDevices, setImportedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);

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
    const ccFile = createColdCardBlob(importedDevices);
    const caravanFile = createCaravanImportFile(importedDevices);

    downloadFile(ccFile, "coldcard_import_file.txt");
    downloadFile(caravanFile, "caravan_import_file.json");
  }

  return (
    <Wrapper>
      <FormContainer>
        <SelectDeviceContainer>
          <XPubHeaderWrapper>
            <BackToMainMenuLink to="..">{'<'} Main Menu</BackToMainMenuLink>
            <SelectDeviceHeader>Create Setup Files</SelectDeviceHeader>
          </XPubHeaderWrapper>
          <CreateFilesHeaderContainer>
            <CreateFilesHeader>Setup Multisig Wallet</CreateFilesHeader>
            <CreateFilesSubheader>
              Connect and unlock devices in order to create your multisig wallet for Coldcard and Caravan.
              You may disconnect your device from your computer once it has been imported.
              </CreateFilesSubheader>
          </CreateFilesHeaderContainer>

          <DeviceSelect
            deviceAction={importDevice}
            configuredDevices={importedDevices}
            unconfiguredDevices={availableDevices}
            setUnconfiguredDevices={setAvailableDevices}
          />
          {importedDevices.length === 3 && <ScanDevicesButton background={green} color={white} onClick={exportSetupFiles}>{'Export Setup Files'}</ScanDevicesButton>}
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
  height: 48px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-top: 12px solid ${blue};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${gray};
`;

const CreateFilesHeaderContainer = styled.div`
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

const CreateFilesHeader = styled.h5`
  font-size: 24px;
  margin: 4px 0;
`;

const CreateFilesSubheader = styled.span`
  font-size: 12px;
`;

const ScanDevicesButton = styled.button`
  ${Button};
  padding: 16px;
  font-size: 16px;
  margin-top: 12px;
  font-weight: 700;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export default CreateFiles;