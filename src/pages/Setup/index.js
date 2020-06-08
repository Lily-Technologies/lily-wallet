import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { AES } from 'crypto-js';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import moment from 'moment';

import { BACKEND_URL } from '../../config';
import { saveFileToGoogleDrive } from '../../utils/google-drive';
import { createConfigFile, createColdCardBlob, downloadFile } from '../../utils/files';
import { Button, DeviceSelectSetup, StyledIcon } from '../../components';
import { GridArea, Header, HeaderLeft, HeaderRight, PageTitle } from '../../components/layout';
import { black, gray, blue, white, darkGreen, offWhite, darkGray, darkOffWhite, lightGray, lightBlue } from '../../utils/colors';

import CreateWallet from './CreateWallet';

const Setup = ({ config, setConfigFile, currentBitcoinNetwork }) => {
  const [setupOption, setSetupOption] = useState(0);
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [importedDevices, setImportedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [password, setPassword] = useState('');
  const [createWallet, setCreateWallet] = useState(true);
  const history = useHistory();

  document.title = `Create Files - Lily Wallet`;

  const importDevice = async (device, index) => {
    const response = await window.ipcRenderer.invoke('/xpub', {
      deviceType: device.type,
      devicePath: device.path,
      path: `m/48'/0'/0'/2'` // we are assuming BIP48 P2WSH wallet
    });

    setImportedDevices([...importedDevices, { ...device, ...response }]);
    availableDevices.splice(index, 1);
    console.log('importedDevices: ', importedDevices);
    setAvailableDevices([...availableDevices]);
  }

  const exportSetupFiles = () => {
    const contentType = "text/plain;charset=utf-8;";

    const ccFile = createColdCardBlob(importedDevices);
    const configObject = createConfigFile(importedDevices, accountName, config, currentBitcoinNetwork);
    const encryptedConfigObject = AES.encrypt(JSON.stringify(configObject), password).toString();
    const encryptedConfigFile = new Blob([decodeURIComponent(encodeURI(encryptedConfigObject))], { type: contentType });

    setConfigFile(configObject);
    downloadFile(ccFile, "coldcard_import_file.txt");
    // KBC-TODO: electron-dl bug requires us to wait for the first file to finish downloading before downloading the second
    // this should be fixed somehow
    setTimeout(() => {
      downloadFile(encryptedConfigFile, `lily_wallet_backup_${moment().format('MMDDYY-hhmmss')}.json`)
    }, 500);
    history.push('/coldcard-import-instructions')
  }

  return (

    <Wrapper>
      {step === 0 ? ( // select account type
        <InnerWrapper>
          <HeaderWrapper>
            <HeaderModified>
              <HeaderLeft>
                <PageTitleSubtext>New Account</PageTitleSubtext>
                <PageTitle>Select account type</PageTitle>
              </HeaderLeft>
              <HeaderRight>
                {config.isEmpty && <CancelButton onClick={() => { history.push('login') }}>Return to Main Menu</CancelButton>}
              </HeaderRight>
            </HeaderModified>
          </HeaderWrapper>
          <SignupOptionMenu>
            <SignupOptionItem style={{ borderTop: `8px solid ${blue}` }} onClick={() => { setSetupOption(1); setStep(1); }}>
              <StyledIcon as={Safe} size={48} style={{ marginBottom: '0.5em' }} />
              <SignupOptionMainText>Vault</SignupOptionMainText>
              <SignupOptionSubtext>Use Coldcards to create a 2-of-3 multisignature vault for securing Bitcoin savings.</SignupOptionSubtext>
            </SignupOptionItem>

            <SignupOptionItem onClick={() => { setSetupOption(2); setStep(1); }}>
              <StyledIcon as={Wallet} size={48} style={{ marginBottom: '0.5em' }} />
              <SignupOptionMainText>Wallet</SignupOptionMainText>
              <SignupOptionSubtext>Create a new hot wallet for discretionary spending</SignupOptionSubtext>
            </SignupOptionItem>
          </SignupOptionMenu>
        </InnerWrapper>
      ) : step === 1 ? ( // input name
        <InnerWrapper>
          <HeaderWrapper>
            <Header>
              <HeaderLeft>
                <PageTitleSubtext>New Account</PageTitleSubtext>
                <PageTitle>Create new {setupOption === 2 ? 'wallet' : 'vault'}</PageTitle>
              </HeaderLeft>
              <HeaderRight>
                {config.isEmpty && <CancelButton onClick={() => { history.push('login') }}>Return to Main Menu</CancelButton>}
                {!config.isEmpty && <CancelButton onClick={() => { setStep(0) }}>Cancel</CancelButton>}
              </HeaderRight>
            </Header>
          </HeaderWrapper>
          <BoxedWrapper>
            <XPubHeaderWrapper>
              <SetupHeaderWrapper>
                <SetupHeader>Give this account a name</SetupHeader>
                <SetupExplainerText>
                  Give this account a name to reference later
                </SetupExplainerText>
              </SetupHeaderWrapper>
            </XPubHeaderWrapper>
            <PasswordWrapper>
              <PasswordInput placeholder="my savings account" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            </PasswordWrapper>

            <ExportFilesButton
              background={blue}
              color={white}
              active={accountName.length > 6}
              onClick={() => {
                if (accountName.length > 6) {
                  setStep(2);
                }
              }}>{`Configure ${setupOption === 2 ? 'Wallet' : 'Vault'}`}</ExportFilesButton>
          </BoxedWrapper>
        </InnerWrapper>
      ) : setupOption === 2 && step === 2 ? ( // new wallet
        <InnerWrapper>
          <HeaderWrapper>
            <Header>
              <HeaderLeft>
                <PageTitleSubtext>New Account</PageTitleSubtext>
                <PageTitle>Create new wallet</PageTitle>
              </HeaderLeft>
              <HeaderRight>
                {config.isEmpty && <CancelButton onClick={() => { history.push('login') }}>Return to Main Menu</CancelButton>}
                {!config.isEmpty && <CancelButton onClick={() => { setStep(0) }}>Cancel</CancelButton>}
              </HeaderRight>
            </Header>
          </HeaderWrapper>
          <CreateWallet
            config={config}
            setConfigFile={setConfigFile}
            accountName={accountName}
            currentBitcoinNetwork={currentBitcoinNetwork}
          />
        </InnerWrapper>
      ) : ( // new vault
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
                <BoxedWrapper>
                  {importedDevices.length < 3 && (
                    <Fragment>
                      <XPubHeaderWrapper>
                        <SetupHeaderWrapper>
                          <SetupHeader>Connect Devices to Computer</SetupHeader>
                          <SetupExplainerText>
                            Connect and unlock devices in order to create your multisignature vault.
                            You may disconnect your device from your computer after it has been configured.
                          </SetupExplainerText>
                        </SetupHeaderWrapper>
                      </XPubHeaderWrapper>
                      <DeviceSelectSetup
                        deviceAction={importDevice}
                        configuredDevices={importedDevices}
                        unconfiguredDevices={availableDevices}
                        setUnconfiguredDevices={setAvailableDevices}
                        configuredThreshold={3}
                      />
                    </Fragment>
                  )}
                  {importedDevices.length === 3 && (
                    <Fragment>
                      <XPubHeaderWrapper>
                        <SetupHeaderWrapper>
                          <SetupHeader>Set a password</SetupHeader>
                          <SetupExplainerText>
                            Lily Wallet encrypts your configuration file so that other people can't steal your funds.
                            Please enter a password to be used to unlock your wallet in the future.
                          </SetupExplainerText>
                        </SetupHeaderWrapper>
                      </XPubHeaderWrapper>
                      <PasswordWrapper>
                        {/* <PasswordText>Almost done, just set a password to encrypt your setup file:</PasswordText> */}
                        <PasswordInput placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                      </PasswordWrapper>
                    </Fragment>
                  )}
                  {
                    importedDevices.length === 3 && <ExportFilesButton
                      background={darkGreen}
                      color={white}
                      active={password.length > 7}
                      onClick={() => {
                        if (password.length > 7) {
                          exportSetupFiles();
                        }
                      }}>{'Save Vault'}</ExportFilesButton>
                  }
                </BoxedWrapper>
              </InnerWrapper>
            )}
    </Wrapper >
  )
}

const CancelButton = styled.div`
  color: ${gray};
  padding: 1em;
  cursor: pointer;
`;

const HeaderModified = styled(Header)`
  margin-bottom: 0;
`;

const PageTitleSubtext = styled.div`
  font-size: 1em;
  color: #869198;
`;

const HeaderWrapper = styled.div`
`;

const SignupOptionMenu = styled(GridArea)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  max-width: 46.875em;
  width: 100%;
  padding: 1.5em 0;
`;

const SignupOptionMainText = styled.div`
  font-size: 1em;
`;

const SignupOptionSubtext = styled.div`
  font-size: .5em;
  margin-top: 0.5em;
  color: ${darkGray};
  padding: 0 3em;
`;

const SignupOptionItem = styled.div`
  background: ${white};
  border: 1px solid ${gray};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  border-radius: 4px;
  min-height: 200px;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  text-align: center;

  &:hover {
                background: ${offWhite};
    cursor: pointer;
  }
`;

const ConfigWallet = styled.div`
  ${Button}
`;

const BoxedWrapper = styled.div`
  background: ${white};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const RecoveryWordsTitle = styled.div``;

const RecoveryWordsText = styled.div`
  font-size: .75em;
  margin-top: 0.5em;
  color: #869198;
`;

const Wrapper = styled.div`
  padding: 1em;
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

const InnerWrapper = styled.div`
  max-width: 46.875em;
  width: 100%;
`;

const XPubHeaderWrapper = styled.div`
  color: ${darkGray};
  background: ${white};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 1.5em 1.5em 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  // border-bottom: 1px solid ${gray};
  border-right: 1px solid ${gray};
  border-left: 1px solid ${gray};
  border-top: 11px solid ${blue};
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
  color: ${black};
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
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${gray};
  border-left: 1px solid ${gray};
  background: ${white};
`;

const PasswordText = styled.h3`
  font-weight: 100;
`;

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightBlue};
  padding: .75em;
  text-align: center;
  color: ${black};
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
  font-weight: 700;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
`;

export default Setup;