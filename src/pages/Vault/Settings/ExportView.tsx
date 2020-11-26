import React, { Fragment, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Network } from 'bitcoinjs-lib';
import { QRCode } from "react-qr-svg";

import { AccountMapContext } from '../../../AccountMapContext';

import { MnemonicWordsDisplayer, Modal, Button } from '../../../components';
import { white, black, gray200, gray500, gray900, green500 } from '../../../utils/colors';

import { CaravanConfig } from '../../../types';

import { mobile } from '../../../utils/media';
import { createColdCardBlob, downloadFile, formatFilename, getMultisigDeriationPathForNetwork } from '../../../utils/files';

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
      <GeneralSection>
        <HeaderSection>
          <HeaderTitle>Export Account</HeaderTitle>
          <HeaderSubtitle>Some users wish to verify the information in Lily with other software. Use the options below to use other software to verify the information in Lily.</HeaderSubtitle>
        </HeaderSection>
        {currentAccount.config.mnemonic && (
          <ProfileRow>
            <ProfileKeyColumn>Mnemonic Words</ProfileKeyColumn>
            <ProfileValueColumn>
              <ProfileValueText></ProfileValueText>
              <ProfileValueAction>
                <ActionButton
                  background={white}
                  color={green500}
                  onClick={() => { openInModal(<MnemonicQrCode />); }}
                >QR Code</ActionButton>
                <ActionButton
                  background={white}
                  color={green500}
                  onClick={() => openInModal(
                    <WordsContainer>
                      <MnemonicWordsDisplayer mnemonicWords={currentAccount.config.mnemonic!} />
                    </WordsContainer>
                  )}>View</ActionButton>
              </ProfileValueAction>
            </ProfileValueColumn>
          </ProfileRow>
        )}
        {currentAccount.config.quorum.totalSigners > 1 && (
          <Fragment>
            <ProfileRow>
              <ProfileKeyColumn>Coldcard Export File</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText></ProfileValueText>
                <ProfileValueAction>
                  <ActionButton
                    background={white}
                    color={green500}
                    onClick={() => { downloadColdcardMultisigFile(); }}
                  >Download</ActionButton>
                </ProfileValueAction>
              </ProfileValueColumn>
            </ProfileRow>
            <ProfileRow>
              <ProfileKeyColumn>Caravan File</ProfileKeyColumn>
              <ProfileValueColumn>
                <ProfileValueText></ProfileValueText>
                <ProfileValueAction>
                  <ActionButton
                    background={white}
                    color={green500}
                    onClick={() => { downloadCaravanFile(); }}
                  >Download</ActionButton>
                </ProfileValueAction>
              </ProfileValueColumn>
            </ProfileRow>
          </Fragment>
        )}
        {currentAccount.config.quorum.totalSigners === 1 && (
          <ProfileRow>
            <ProfileKeyColumn>Extended Public Key (XPub)</ProfileKeyColumn>
            <ProfileValueColumn>
              <ProfileValueText></ProfileValueText>
              <ProfileValueAction>
                <ActionButton
                  background={white}
                  color={green500}
                  onClick={() => { openInModal(<XpubQrCode />); }}
                >Download</ActionButton>
              </ProfileValueAction>
            </ProfileValueColumn>
          </ProfileRow>
        )}
      </GeneralSection>
    </Fragment >
  )
}

const HeaderSection = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1em;
`;

const HeaderTitle = styled.h3`
  color: ${gray900};
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.5em;
`;

const HeaderSubtitle = styled.span`
  color: ${gray500};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  max-width: 42rem;
`;

const GeneralSection = styled.div`
  padding: 0.5em 1.5em;
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-top: 1px solid ${gray200};

  ${mobile(css`
    display: block;
  `)}
`;

const ProfileKeyColumn = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 600;
  align-items: center;
  display: flex;
`;

const ProfileValueColumn = styled.div`
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
`;

const ProfileValueText = styled.span`
  flex: 1;
`;

const ProfileValueAction = styled.span`
  margin-left: 1rem;
  display: flex;
`;

const ActionButton = styled.button`
  ${Button};
  font-weight: 600;
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

const ScanInstructions = styled.div`
  font-size: 0.5em;
  padding: 1.5em 0;
`

export default ExportView;