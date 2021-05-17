import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Network } from "bitcoinjs-lib";
import { QRCode } from "react-qr-svg";
import { CoboVaultSDK } from "@cvbb/sdk";

import { AccountMapContext } from "../../../AccountMapContext";

import {
  MnemonicWordsDisplayer,
  AnimatedQrCode,
  Modal,
  ModalContentWrapper,
  SettingsTable,
} from "../../../components";
import { white, black, gray100, green500 } from "../../../utils/colors";

import { CaravanConfig } from "../../../types";

import {
  createColdCardBlob,
  downloadFile,
  formatFilename,
  getMultisigDeriationPathForNetwork,
} from "../../../utils/files";

const sdk = new CoboVaultSDK();
interface Props {
  currentBitcoinNetwork: Network;
}

const ExportView = ({ currentBitcoinNetwork }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
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
          "txt"
        )
      );
    }
  };

  const downloadCaravanFile = () => {
    // need to add some properties to our config to use with Caravan
    const configCopy = { ...currentAccount.config } as CaravanConfig;
    configCopy.client = { type: "public" };
    // need to have a name for each pubkey, so just use parentFingerprint
    if (configCopy.extendedPublicKeys !== undefined) {
      for (let i = 0; i < configCopy.extendedPublicKeys.length; i++) {
        configCopy.extendedPublicKeys[i].name =
          configCopy.extendedPublicKeys[i].parentFingerprint;

        // we need to populate the method field for caravan. if the device is of type trezor or ledger, put that in. else just put xpub.
        if (
          configCopy.extendedPublicKeys[i].device &&
          (configCopy.extendedPublicKeys[i].device.type === "trezor" ||
            configCopy.extendedPublicKeys[i].device.type === "ledger")
        ) {
          configCopy.extendedPublicKeys[i].method =
            configCopy.extendedPublicKeys[i].device.type;
          configCopy.extendedPublicKeys[i].bip32Path =
            getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
        } else {
          configCopy.extendedPublicKeys[i].method = "xpub";
        }
      }
    }
    const caravanFile = JSON.stringify(configCopy);
    downloadFile(
      caravanFile,
      formatFilename("lily-caravan-file", currentBitcoinNetwork, "json")
    );
  };

  const CoboVaultQrCode = () => {
    const ccFile = createColdCardBlob(
      currentAccount.config.quorum.requiredSigners,
      currentAccount.config.quorum.totalSigners,
      currentAccount.config.name,
      currentAccount.config.extendedPublicKeys,
      currentBitcoinNetwork
    );
    const ccFileEncoded = sdk.encodeDataForQR(ccFile);
    return (
      <Container>
        <ModalHeaderContainer>Scan this with your device</ModalHeaderContainer>
        <ModalContent>
          <OutputItem style={{ wordBreak: "break-word" }}>
            <AnimatedQrCode valueArray={ccFileEncoded} />
          </OutputItem>
        </ModalContent>
      </Container>
    );
  };

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

  const XpubQrCode = () => (
    <QRCode
      bgColor={white}
      fgColor={black}
      level="Q"
      style={{ width: 256 }}
      value={currentAccount.config.extendedPublicKeys[0].xpub as string}
    />
  );

  const MnemonicQrCode = () => (
    <ModalContentWrapper>
      <QRCode
        bgColor={white}
        fgColor={black}
        level="Q"
        style={{ width: 256 }}
        value={currentAccount.config.mnemonic as string}
      />
      <ScanInstructions>
        Scan this QR code to import this wallet into BlueWallet
      </ScanInstructions>
    </ModalContentWrapper>
  );

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Export Account</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          Use the options below to use other software to verify the information
          in Lily.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      {currentAccount.config.mnemonic && (
        <SettingsTable.Row>
          <SettingsTable.KeyColumn>Mnemonic Words</SettingsTable.KeyColumn>
          <SettingsTable.ValueColumn>
            <SettingsTable.ValueText></SettingsTable.ValueText>
            <SettingsTable.ValueAction>
              <SettingsTable.ActionButton
                background={white}
                color={green500}
                onClick={() => {
                  openInModal(<MnemonicQrCode />);
                }}
              >
                QR Code
              </SettingsTable.ActionButton>
              <SettingsTable.ActionButton
                background={white}
                color={green500}
                onClick={() =>
                  openInModal(
                    <WordsContainer>
                      <MnemonicWordsDisplayer
                        mnemonicWords={currentAccount.config.mnemonic!}
                      />
                    </WordsContainer>
                  )
                }
              >
                View
              </SettingsTable.ActionButton>
            </SettingsTable.ValueAction>
          </SettingsTable.ValueColumn>
        </SettingsTable.Row>
      )}
      {currentAccount.config.quorum.totalSigners > 1 && (
        <>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>
              Coldcard Export File
            </SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <SettingsTable.ActionButton
                  background={white}
                  color={green500}
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
            <SettingsTable.KeyColumn>Cobo Vault File</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <SettingsTable.ActionButton
                  background={white}
                  color={green500}
                  onClick={() => {
                    openInModal(<CoboVaultQrCode />);
                  }}
                >
                  View QR Code
                </SettingsTable.ActionButton>
              </SettingsTable.ValueAction>
            </SettingsTable.ValueColumn>
          </SettingsTable.Row>
          <SettingsTable.Row></SettingsTable.Row>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>Caravan File</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <SettingsTable.ActionButton
                  background={white}
                  color={green500}
                  onClick={() => {
                    downloadCaravanFile();
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
          <SettingsTable.KeyColumn>
            Extended Public Key (XPub)
          </SettingsTable.KeyColumn>
          <SettingsTable.ValueColumn>
            <SettingsTable.ValueText></SettingsTable.ValueText>
            <SettingsTable.ValueAction>
              <SettingsTable.ActionButton
                background={white}
                color={green500}
                onClick={() => {
                  openInModal(<XpubQrCode />);
                }}
              >
                Download
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

const WordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  justify-content: center;
`;

const ScanInstructions = styled.div`
  font-size: 0.5em;
  padding: 1.5em 0;
`;

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

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  background: ${gray100};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const ModalContent = styled.div``;

export default ExportView;
