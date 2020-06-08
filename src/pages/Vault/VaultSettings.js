import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { AES } from 'crypto-js';
import { Link, useHistory } from "react-router-dom";
import Modal from 'react-modal';
import { QRCode } from "react-qr-svg";
import { bip32 } from 'bitcoinjs-lib';

import { black, gray, white, blue, darkGray, darkOffWhite, lightBlue, red } from '../../utils/colors';
import { saveFileToGoogleDrive } from '../../utils/google-drive';
import { mobile } from '../../utils/media';
import { createColdCardBlob, downloadFile } from '../../utils/files';

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

const VaultSettings = ({ config, setConfigFile, currentAccount, setViewAddresses, setViewUtxos, currentBitcoinNetwork }) => {
  const [viewExportQRCode, setViewExportQRCode] = useState(false);
  const history = useHistory();

  console.log('currentBitcoinNetwork: ', currentBitcoinNetwork);

  const downloadColdcardMultisigFile = () => {
    const ccFile = createColdCardBlob(currentAccount.config.extendedPublicKeys);
    downloadFile(ccFile, "coldcard_import_file.txt");
  }

  const getQrCode = () => {
    const node = bip32.fromBase58(currentAccount.config.xprv, currentBitcoinNetwork);
    const wif = node.derivePath("m/84'/0'/0'");
    console.log('wif: ', wif);

    const otherWif = bip32.fromSeed(Buffer.from(currentAccount.config.seed, 'hex'), currentBitcoinNetwork).toWIF();

    const abip32 = bip32.fromSeed(Buffer.from(currentAccount.config.seed, 'hex'), currentBitcoinNetwork);

    const path = "m/84'/0'/0'";
    const child = abip32.derivePath(path);
    const anotherWif = child.toWIF();

    return (
      <div>
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={wif}
        />
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={otherWif}
        />
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={anotherWif}
        />
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={currentAccount.config.zpub}
        />

      </div>
    )
  }

  return (

    <Wrapper>
      <TotalValueHeader>Settings</TotalValueHeader>
      <SettingsHeadingItem>Vault Data</SettingsHeadingItem>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsHeader>XPubs</SettingsHeader>
          <SettingsSubheader>View the xpubs associated with this vault</SettingsSubheader>
        </SettingsSectionLeft>
        <SettingsSectionRight>
          <ViewAddressesButton>View XPubs</ViewAddressesButton>
        </SettingsSectionRight>
      </SettingsSection>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsHeader>Addresses</SettingsHeader>
          <SettingsSubheader>View the addresses associated with this vault</SettingsSubheader>
        </SettingsSectionLeft>
        <SettingsSectionRight>
          <ViewAddressesButton onClick={() => { setViewAddresses(true); }}>View Addresses</ViewAddressesButton>
        </SettingsSectionRight>
      </SettingsSection>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsHeader>UTXOs</SettingsHeader>
          <SettingsSubheader>View the UTXOs associated with this vault</SettingsSubheader>
        </SettingsSectionLeft>
        <SettingsSectionRight>
          <ViewAddressesButton onClick={() => { setViewUtxos(true); }}>View UTXOs</ViewAddressesButton>
        </SettingsSectionRight>
      </SettingsSection>

      <SettingsHeadingItem>Export Wallet</SettingsHeadingItem>
      {currentAccount.config.quorum.totalSigners === 1 && (
        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsHeader>Connect to BlueWallet</SettingsHeader>
            <SettingsSubheader>View a QR code to import this wallet into BlueWallet</SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton onClick={() => { setViewExportQRCode(true); }}>View QR Code</ViewAddressesButton>
          </SettingsSectionRight>

          <Modal
            isOpen={viewExportQRCode}
            onRequestClose={() => setViewExportQRCode(false)}
            style={modalStyles}>

            {getQrCode()}
          </Modal>


        </SettingsSection>
      )}
      {currentAccount.config.quorum.totalSigners > 1 && (
        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsHeader>Download Coldcard File</SettingsHeader>
            <SettingsSubheader>
              Download the multisig wallet import file for Coldcard and place on microsd card. <br />
              Import via Settings > Multisig > Import from SD.
            </SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton onClick={() => { downloadColdcardMultisigFile(); }}>Download Coldcard File</ViewAddressesButton>
          </SettingsSectionRight>
        </SettingsSection>
      )}

      <SettingsHeadingItem>Danger Zone</SettingsHeadingItem>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsHeader>Delete Account</SettingsHeader>
          <SettingsSubheader>Remove this account from your list of accounts.</SettingsSubheader>
        </SettingsSectionLeft>
        <SettingsSectionRight>
          <ViewAddressesButton
            style={{ color: red, border: `1px solid ${red}` }}
            onClick={() => {
              const configCopy = { ...config };
              if (currentAccount.config.quorum.requiredSigners === 1) {
                configCopy.wallets = configCopy.wallets.filter((wallet) => wallet.id !== currentAccount.config.id)
              } else {
                configCopy.vaults = configCopy.vaults.filter((vault) => vault.id !== currentAccount.config.id)
              }

              const encryptedConfigObject = AES.encrypt(JSON.stringify(configCopy), 'testtest').toString();

              saveFileToGoogleDrive(encryptedConfigObject);
              setConfigFile(configCopy);
              history.push('/settings');

            }}>Delete Account</ViewAddressesButton>
        </SettingsSectionRight>
      </SettingsSection>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${lightBlue};
  padding: 1.5em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-top: solid 11px ${blue};
`;

const SettingsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  grid-gap: 5em;
  margin: 1em 0;
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
  grid-column: span 2;

  ${mobile(css`
    grid-column: span 1;
  `)};
`;

const SettingsSectionRight = styled.div``;

const SettingsSubheader = styled.div`
  display: flex;
  font-size: 0.875em;
  color: ${darkGray};
  margin: 8px 0;
`;

const SettingsHeader = styled.div`
  display: flex;
  font-size: 1.125em;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${darkGray};
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${blue};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`;

const TotalValueHeader = styled.div`
  font-size: 36px;
`;

export default VaultSettings;