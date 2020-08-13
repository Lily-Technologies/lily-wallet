import React, { useState } from 'react';
import styled from 'styled-components';


import { Button, DeviceSelect, FileUploader } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';
import { darkGray, white } from '../../utils/colors';

import RequiredDevicesModal from './RequiredDevicesModal';

const NewVaultScreen = ({
  header,
  config,
  setStep,
  importMultisigWalletFromFile,
  importDeviceFromFile,
  importDevice,
  importedDevices,
  availableDevices,
  errorDevices,
  setAvailableDevices,
  setConfigRequiredSigners,
  configRequiredSigners
}) => {
  const [selectNumberRequiredModalOpen, setSelectNumberRequiredModalOpen] = useState(false);

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
              if (parsedFile.seed_version) { // is a multisig file
                importMultisigWalletFromFile(parsedFile)
              } else { // is a wallet export file
                importDeviceFromFile(parsedFile)
              }
            }}
          />

          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Connect Devices to Computer</SetupHeader>
                <SetupExplainerText>
                  Devices unlocked and connected to your computer will appear here. Click on them to include them in your vault.
                  You may disconnect a device from your computer after it has been imported.
                  </SetupExplainerText>
              </div>
              <ImportFromFileButton htmlFor="localConfigFile" background={white} color={darkGray}>Import from File</ImportFromFileButton>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <DeviceSelect
            deviceAction={importDevice}
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
            // if (importedDevices.length === 1) {
            //   setStep(3);
            // } else {
            setSelectNumberRequiredModalOpen(true)
            // }
          }}>Finish Adding Devices</ContinueButton>}
      </FormContainer>

      <RequiredDevicesModal
        selectNumberRequiredModalOpen={selectNumberRequiredModalOpen}
        setSelectNumberRequiredModalOpen={setSelectNumberRequiredModalOpen}
        numberOfImportedDevices={importedDevices.length}
        setConfigRequiredSigners={setConfigRequiredSigners}
        configRequiredSigners={configRequiredSigners}
        setStep={setStep}
      />
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

export default NewVaultScreen;