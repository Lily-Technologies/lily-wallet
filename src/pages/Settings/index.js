import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { AES } from 'crypto-js';
import moment from 'moment';
import Modal from 'react-modal';

import { PageWrapper, PageTitle, Header, HeaderLeft, Button } from '../../components';

import { blue, darkGray, white, lightBlue, darkOffWhite, lightGray, gray } from '../../utils/colors';
import { downloadFile } from '../../utils/files';
import { mobile } from '../../utils/media';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    width: '100%',
    minHeight: '500px'
  }
}

const Settings = ({ config }) => {
  const [downloadConfigModalIsOpen, setDownloadConfigModalIsOpen] = useState(false);
  const [password, setPassword] = useState(null);


  const downloadCurrentConfig = (password) => {
    const contentType = "text/plain;charset=utf-8;";
    const encryptedConfigObject = AES.encrypt(JSON.stringify(config), password).toString();
    var encryptedConfigFile = new Blob([decodeURIComponent(encodeURI(encryptedConfigObject))], { type: contentType });
    downloadFile(encryptedConfigFile, `lily_wallet_config-${moment().format()}.txt`);
  }

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>Settings</PageTitle>
        </HeaderLeft>
      </Header>
      <ValueWrapper>
        <SettingsHeadingItem style={{ marginTop: '0.5em' }}>Data and Backups</SettingsHeadingItem>
        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsHeader>Export Current Configuration</SettingsHeader>
            <SettingsSubheader>Download your current vault configuration. This allows you to import your current configuration on a different machine running Lily.</SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton
              onClick={() => setDownloadConfigModalIsOpen(true)}>
              Download Current Config
              </ViewAddressesButton>
          </SettingsSectionRight>
          <Modal
            isOpen={downloadConfigModalIsOpen}
            onRequestClose={() => setDownloadConfigModalIsOpen(false)}
            style={modalStyles}>

            <PasswordWrapper>
              <PasswordText>Almost done, just set a password to encrypt your setup file:</PasswordText>
              <PasswordInput placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </PasswordWrapper>
            <WordContainer>
              <SaveWalletButton onClick={() => downloadCurrentConfig(password)}>
                Download Encrypted Configuration File
              </SaveWalletButton>
            </WordContainer>
          </Modal>
        </SettingsSection>
      </ValueWrapper>
    </PageWrapper >
  )
};


const ValueWrapper = styled.div`
  background: ${lightBlue};
  padding: 1.5em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-top: solid 11px ${blue} !important;
  border: 1px solid ${darkGray};
`;

const SettingsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  grid-gap: 5em;
  margin: 3.125em 0;
  justify-content: space-between;
  padding: 1.5em;
  background: ${white};
  border: 1px solid ${darkGray};
  align-items: center;

  ${mobile(css`
  grid-gap: 2em;
  `)};
`;

const SettingsSectionLeft = styled.div`

`;

const SettingsSectionRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;


const SettingsHeader = styled.div`
  display: flex;
  font-size: 18px;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 4em 0 0;
  font-weight: 400;
  color: ${darkGray};
`;


const SettingsSubheader = styled.div`
  display: flex;
  font-size: .9em;
  color: ${darkGray};
  margin: 8px 0;
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${blue};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  
  &:hover {
    cursor: pointer;
  }
`;

const PasswordWrapper = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
`;

const PasswordText = styled.h3`
  font-weight: 400;
`;

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

const SaveWalletButton = styled.div`
  ${Button};
  flex: 1;
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
`;


export default Settings