import React, { useState } from 'react';
import styled from 'styled-components';
import bs58check from 'bs58check';

import { Button, DeviceSelect, FileUploader } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';
import { darkGray, white } from '../../utils/colors';
import { zpubToXpub } from '../../utils/other';
import { getP2shDeriationPathForNetwork } from '../../utils/transactions';

const NewHardwareWalletScreen = ({
  header,
  config,
  setStep,
  importedDevices,
  setImportedDevices,
  currentBitcoinNetwork
}) => {
  const [availableDevices, setAvailableDevices] = useState([]);
  const [errorDevices, setErrorDevices] = useState([]);

  const importSingleSigDevice = async (device, index) => {
    try {
      const response = await window.ipcRenderer.invoke('/xpub', {
        deviceType: device.type,
        devicePath: device.path,
        path: getP2shDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
      });

      setImportedDevices([...importedDevices, { ...device, ...response }]);
      availableDevices.splice(index, 1);
      if (errorDevices.includes(device.fingerprint)) {
        const errorDevicesCopy = [...errorDevices];
        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
        setErrorDevices(errorDevicesCopy);
      }
      setAvailableDevices([...availableDevices]);

      setStep(3);
    } catch (e) {
      const errorDevicesCopy = [...errorDevices];
      errorDevicesCopy.push(device.fingerprint);
      setErrorDevices([...errorDevicesCopy])
    }
  }

  const importDeviceFromFile = (parsedFile) => {
    const zpub = bs58check.decode(parsedFile.p2wsh);
    const xpub = zpubToXpub(zpub);

    const newDevice = {
      type: 'coldcard',
      fingerprint: parsedFile.xfp,
      xpub: xpub
    }

    const updatedImportedDevices = [...importedDevices, newDevice];
    setImportedDevices(updatedImportedDevices)
  }

  return (
    <InnerWrapper>
      {header}
      <FormContainer>
        <BoxedWrapper>
          <FileUploader
            accept="*"
            id="localConfigFile"
            onFileLoad={(file) => {
              const parsedFile = JSON.parse(file);
              // TODO: should probably have better checking for files to make sure users aren't uploading "weird" files
              importDeviceFromFile(parsedFile)
            }}
          />

          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Connect hardware wallet to computer</SetupHeader>
                <SetupExplainerText>
                  Plug your hardware wallet into your computer and unlock it. If you're using a Ledger, you will need to open the Bitcoin app to access it.
                  You can also add your hardware wallet like Coldcard by importing the file from an SD card.
                  </SetupExplainerText>
              </div>
              <ImportFromFileButton htmlFor="localConfigFile" background={white} color={darkGray}>Import from File</ImportFromFileButton>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <DeviceSelect
            deviceAction={importSingleSigDevice}
            deviceActionText={'Click to Configure'}
            deviceActionLoadingText={'Extracting XPub'}
            configuredDevices={importedDevices}
            unconfiguredDevices={availableDevices}
            errorDevices={errorDevices}
            setUnconfiguredDevices={setAvailableDevices}
            configuredThreshold={15}
          />
        </BoxedWrapper>
        {importedDevices.length > 1 && <ContinueButton
          onClick={() => {
            setStep(3);
          }}>Continue</ContinueButton>}
      </FormContainer>
    </InnerWrapper>
  )
}

const ContinueButton = styled.div`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`;

const ImportFromFileButton = styled.label`
  ${Button}
  font-size: 0.75em;
  border: 1px solid ${darkGray};
`;

export default NewHardwareWalletScreen;