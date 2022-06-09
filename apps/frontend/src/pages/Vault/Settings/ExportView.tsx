import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Network } from 'bitcoinjs-lib';
import { QRCode } from 'react-qr-svg';

import { requireOnchain } from 'src/hocs';

import { MnemonicWordsDisplayer, Modal, SettingsTable } from 'src/components';
import { white, black, gray100 } from 'src/utils/colors';

import { CaravanConfig, LilyOnchainAccount, OnChainConfig } from '@lily/types';

import {
  createColdCardBlob,
  downloadFile,
  formatFilename,
  getMultisigDeriationPathForNetwork
} from 'src/utils/files';
import { PlatformContext } from 'src/context';

interface Props {
  currentAccount: LilyOnchainAccount;
  currentBitcoinNetwork: Network;
}

const ExportView = ({ currentAccount, currentBitcoinNetwork }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const downloadColdcardMultisigFile = () => {
    if (currentAccount.config.extendedPublicKeys) {
      const ccFile = createColdCardBlob(
        currentAccount.config.quorum.requiredSigners,
        currentAccount.config.quorum.totalSigners,
        currentAccount.config.name,
        currentAccount.config.extendedPublicKeys,
        currentBitcoinNetwork
      );
      downloadFile(
        ccFile,
        formatFilename(
          `${currentAccount.config.name}-lily-coldcard-file`,
          currentBitcoinNetwork,
          'txt'
        ),
        platform
      );
    }
  };

  const downloadLilyFile = (config: OnChainConfig) => {
    const configCopy = { ...config };
    const lilyFile = JSON.stringify(configCopy);
    downloadFile(
      lilyFile,
      formatFilename(`${config.name}-lily`, currentBitcoinNetwork, 'json'),
      platform
    );
  };

  const downloadCaravanFile = (config: OnChainConfig) => {
    // need to add some properties to our config to use with Caravan
    // @ts-ignore-line
    const configCopy = {
      ...config,
      client: { type: 'public' }
    } as CaravanConfig;
    // need to have a name for each pubkey, so just use parentFingerprint
    if (configCopy.extendedPublicKeys !== undefined) {
      for (let i = 0; i < configCopy.extendedPublicKeys.length; i++) {
        configCopy.extendedPublicKeys[i].name = configCopy.extendedPublicKeys[i].parentFingerprint;

        // we need to populate the method field for caravan. if the device is of type trezor or ledger, put that in. else just put xpub.
        if (
          configCopy.extendedPublicKeys[i].device &&
          (configCopy.extendedPublicKeys[i].device.type === 'trezor' ||
            configCopy.extendedPublicKeys[i].device.type === 'ledger')
        ) {
          configCopy.extendedPublicKeys[i].method = configCopy.extendedPublicKeys[i].device.type;
          configCopy.extendedPublicKeys[i].bip32Path =
            getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
        } else {
          configCopy.extendedPublicKeys[i].method = 'xpub';
        }
      }
    }
    const caravanFile = JSON.stringify(configCopy);
    downloadFile(
      caravanFile,
      formatFilename('lily-caravan-file', currentBitcoinNetwork, 'json'),
      platform
    );
  };

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

  const XpubQrCode = () => (
    <Container>
      <ModalHeaderContainer>Scan this with your device</ModalHeaderContainer>
      <ModalContent>
        <QRCode
          bgColor={white}
          fgColor={black}
          level='Q'
          style={{ width: 256 }}
          value={currentAccount.config.extendedPublicKeys[0].xpub as string}
        />
      </ModalContent>
    </Container>
  );

  const MnemonicQrCode = () => (
    <Container>
      <ModalHeaderContainer>Scan this with your device</ModalHeaderContainer>
      <ModalContent>
        <QRCode
          bgColor={white}
          fgColor={black}
          level='Q'
          style={{ width: 256 }}
          value={currentAccount.config.mnemonic as string}
        />
      </ModalContent>
    </Container>
  );

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Export Account</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          Use the options below to use other software to verify the information in Lily.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      {currentAccount.config.mnemonic && (
        <SettingsTable.Row>
          <SettingsTable.KeyColumn>Mnemonic Words</SettingsTable.KeyColumn>
          <SettingsTable.ValueColumn>
            <SettingsTable.ValueText></SettingsTable.ValueText>
            <SettingsTable.ValueAction style={{ display: 'flex' }}>
              <SettingsTable.ActionButton
                onClick={() => {
                  openInModal(<MnemonicQrCode />);
                }}
              >
                View QR Code
              </SettingsTable.ActionButton>
              <SettingsTable.ActionButton
                onClick={() =>
                  openInModal(
                    <Container>
                      <ModalHeaderContainer>
                        Do not share these words with anyone.
                      </ModalHeaderContainer>
                      <ModalContent>
                        <MnemonicWordsDisplayer mnemonicWords={currentAccount.config.mnemonic!} />
                      </ModalContent>
                    </Container>
                  )
                }
              >
                View Words
              </SettingsTable.ActionButton>
            </SettingsTable.ValueAction>
          </SettingsTable.ValueColumn>
        </SettingsTable.Row>
      )}
      {currentAccount.config.quorum.totalSigners > 1 && (
        <>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>Lily Backup</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <SettingsTable.ActionButton
                  onClick={() => {
                    downloadLilyFile(currentAccount.config);
                  }}
                >
                  Download
                </SettingsTable.ActionButton>
              </SettingsTable.ValueAction>
            </SettingsTable.ValueColumn>
          </SettingsTable.Row>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>Coldcard Multisig File</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <SettingsTable.ActionButton
                  onClick={() => {
                    downloadColdcardMultisigFile();
                  }}
                >
                  Download
                </SettingsTable.ActionButton>
              </SettingsTable.ValueAction>
            </SettingsTable.ValueColumn>
          </SettingsTable.Row>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>Caravan File</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <SettingsTable.ActionButton
                  onClick={() => {
                    downloadCaravanFile(currentAccount.config);
                  }}
                >
                  Download
                </SettingsTable.ActionButton>
              </SettingsTable.ValueAction>
            </SettingsTable.ValueColumn>
          </SettingsTable.Row>
        </>
      )}
      {currentAccount.config.quorum.totalSigners === 1 && (
        <SettingsTable.Row>
          <SettingsTable.KeyColumn>Extended Public Key (XPub)</SettingsTable.KeyColumn>
          <SettingsTable.ValueColumn>
            <SettingsTable.ValueText></SettingsTable.ValueText>
            <SettingsTable.ValueAction>
              <SettingsTable.ActionButton
                onClick={() => {
                  openInModal(<XpubQrCode />);
                }}
              >
                View QR Code
              </SettingsTable.ActionButton>
            </SettingsTable.ValueAction>
          </SettingsTable.ValueColumn>
        </SettingsTable.Row>
      )}
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </SettingsTable.Wrapper>
  );
};

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5em;
  background: ${gray100};
`;

export default requireOnchain(ExportView);
