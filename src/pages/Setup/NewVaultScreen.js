import React from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';


import { Button, DeviceSelect, FileUploader } from '../../components';
import { InnerWrapper, HeaderWrapper, CancelButton, PageTitleSubtext, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';
import { Header, HeaderLeft, HeaderRight, PageTitle } from '../../components/layout';
import { darkGray, white } from '../../utils/colors';

const NewVaultScreen = ({ config, setStep, importMultisigWalletFromFile, importDeviceFromFile, importDevice, importedDevices, availableDevices, errorDevices, setAvailableDevices }) => {
  const history = useHistory();

  return (
    <InnerWrapper>
      <HeaderWrapper>
        <Header>
          <HeaderLeft>
            <PageTitleSubtext>New Account</PageTitleSubtext>
            <PageTitle>Create new vault</PageTitle>
          </HeaderLeft>
          <HeaderRight>
            {config.isEmpty && <CancelButton onClick={() => { history.push('login') }}>Return to Main Menu</CancelButton>}
            {!config.isEmpty && <CancelButton onClick={() => { setStep(0) }}>Cancel</CancelButton>}
          </HeaderRight>
        </Header>
      </HeaderWrapper>
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
                  Connect and unlock devices in order to create your multisignature vault.
                  You may disconnect your device from your computer after it has been configured.
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
      </FormContainer>
    </InnerWrapper>
  )
}

const ImportFromFileButton = styled.label`
  ${Button}
  font-size: 0.75em;
  border: 1px solid ${darkGray};
`;

export default NewVaultScreen;