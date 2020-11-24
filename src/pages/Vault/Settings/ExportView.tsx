import React, { Fragment, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Network } from 'bitcoinjs-lib';
import { QRCode } from "react-qr-svg";

import { AccountMapContext } from '../../../AccountMapContext';

import { MnemonicWordsDisplayer, Modal } from '../../../components';
import { white, black, gray500, gray900, green800 } from '../../../utils/colors';

import { CaravanConfig } from '../../../types';

import { mobile } from '../../../utils/media';
import { createColdCardBlob, downloadFile, formatFilename, saveConfig, getMultisigDeriationPathForNetwork } from '../../../utils/files';

interface Props {
  currentBitcoinNetwork: Network
}

const ExportView = ({ currentBitcoinNetwork }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  }

  const downloadColdcardMultisigFile = () => {
    if (currentAccount.config.extendedPublicKeys) {
      const ccFile = createColdCardBlob(currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners, currentAccount.config.name, currentAccount.config.extendedPublicKeys, currentBitcoinNetwork);
      downloadFile(ccFile, formatFilename(`${currentAccount.config.name}-lily-coldcard-file`, currentBitcoinNetwork, 'txt'));
    }
  }

  const downloadCaravanFile = () => {
    // need to add some properties to our config to use with Caravan
    const configCopy = { ...currentAccount.config } as CaravanConfig;
    configCopy.client = { type: 'public' };
    // need to have a name for each pubkey, so just use parentFingerprint
    if (configCopy.extendedPublicKeys !== undefined) {
      for (let i = 0; i < configCopy.extendedPublicKeys.length; i++) {
        configCopy.extendedPublicKeys[i].name = configCopy.extendedPublicKeys[i].parentFingerprint;

        // we need to populate the method field for caravan. if the device is of type trezor or ledger, put that in. else just put xpub.
        if (configCopy.extendedPublicKeys[i].device && (configCopy.extendedPublicKeys[i].device.type === 'trezor' || configCopy.extendedPublicKeys[i].device.type === 'ledger')) {
          configCopy.extendedPublicKeys[i].method = configCopy.extendedPublicKeys[i].device.type;
          configCopy.extendedPublicKeys[i].bip32Path = getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
        } else {
          configCopy.extendedPublicKeys[i].method = 'xpub';
        }
      }
    }
    const caravanFile = JSON.stringify(configCopy);
    downloadFile(caravanFile, formatFilename('lily-caravan-file', currentBitcoinNetwork, 'json'));
  }

  const XpubQrCode = () => (
    <QRCode
      bgColor={white}
      fgColor={black}
      level="Q"
      style={{ width: 256 }}
      value={currentAccount.config.xpub as string}
    />
  )

  const MnemonicQrCode = () => (
    <ModalContentWrapper>
      <QRCode
        bgColor={white}
        fgColor={black}
        level="Q"
        style={{ width: 256 }}
        value={currentAccount.config.mnemonic as string}
      />
      <ScanInstructions>Scan this QR code to import this wallet into BlueWallet</ScanInstructions>
    </ModalContentWrapper>
  )

  return (
    <Fragment>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}>
        {modalContent as React.ReactChild}
      </Modal>
      {currentAccount.config.mnemonic && (
        <Fragment>
          <SettingsHeadingItem>Export Wallet</SettingsHeadingItem>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsItemHeader>Connect to BlueWallet</SettingsItemHeader>
              <SettingsSubheader>View a QR code to import this wallet into BlueWallet</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { openInModal(<MnemonicQrCode />); }}>View QR Code</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsItemHeader>View Mnemonic Seed</SettingsItemHeader>
              <SettingsSubheader>View the mnemonic phrase for this wallet. This can be used to import this wallet data into another application.</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => {
                openInModal(
                  <WordsContainer>
                    <MnemonicWordsDisplayer mnemonicWords={currentAccount.config.mnemonic!} />
                  </WordsContainer>
                );
              }}>View Wallet Mnemonic</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
        </Fragment>
      )}
      {currentAccount.config.quorum.totalSigners > 1 && (
        <Fragment>
          <SettingsHeadingItem>Export Wallet</SettingsHeadingItem>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsItemHeader>Download Coldcard File</SettingsItemHeader>
              <SettingsSubheader>
                Download the multisig wallet import file for Coldcard and place on microsd card. <br />
              Import via Settings &gt; Multisig &gt; Import from SD.
            </SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { downloadColdcardMultisigFile(); }}>Download Coldcard File</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsItemHeader>Download Caravan File</SettingsItemHeader>
              <SettingsSubheader>
                <span>Download this vault's configuration file to use in <UnchainedCapitalLink href="https://unchained-capital.com/" target="_blank" rel="noopener noreferrer">Unchained Capital's</UnchainedCapitalLink> <UnchainedCapitalLink href="https://unchained-capital.github.io/caravan/#/" target="_blank" rel="noopener noreferrer">Caravan</UnchainedCapitalLink> multisig coordination software.</span>
              </SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { downloadCaravanFile(); }}>Download Caravan File</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
        </Fragment>
      )}
      {currentAccount.config.quorum.totalSigners === 1 && (
        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsItemHeader>View XPub</SettingsItemHeader>
            <SettingsSubheader>View the xpub associated with this vault. This can be given to other services to deposit money into your account or create a read-only wallet.</SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton onClick={() => { openInModal(<XpubQrCode />); }}>View XPub</ViewAddressesButton>
          </SettingsSectionRight>
        </SettingsSection>
      )}
    </Fragment>
  )
}

const SettingsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  grid-gap: 5em;
  margin: 1em 0;
  justify-content: space-between;
  padding: 1.5em;
  background: ${white};
  align-items: center;
  padding: 2.5em 2em;
  // box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  // border-radius: 0.375em;

  ${mobile(css`
    grid-gap: 2em;
  `)};
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5em;
  align-items: flex-start;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};  
`;

const WordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  justify-content: center;
`;

const SettingsSectionLeft = styled.div`
  grid-column: span 2;

  ${mobile(css`
    grid-column: span 1;
  `)};
`;

const UnchainedCapitalLink = styled.a`
  color: ${gray900};
  font-weight: 400;
  text-decoration: none;

  &:visited {
    color: ${gray900};
  }
`;

const SettingsSectionRight = styled.div``;

const SettingsSubheader = styled.div`
  display: flex;
  font-size: 0.875em;
  color: ${gray500};
  margin: 8px 0;
`;

const SettingsItemHeader = styled.div`
  display: flex;
  font-size: 1.125em;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${gray900};
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${green800};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`;

const ScanInstructions = styled.div`
  font-size: 0.5em;
  padding: 1.5em 0;
`

export default ExportView;