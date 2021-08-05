import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import { decode } from "bs58check";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { Network } from "bitcoinjs-lib";
import { v4 as uuidv4 } from "uuid";
import { blockExplorerAPIURL } from "unchained-bitcoin";

import { CursorClick } from "@styled-icons/heroicons-solid";

import {
  Button,
  DeviceSelect,
  FileUploader,
  Dropdown,
  ErrorModal,
  Modal,
  StyledIcon,
} from "../../components";
import {
  InnerWrapper,
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  SetupExplainerText,
  FormContainer,
  BoxedWrapper,
  SetupHeader,
} from "./styles";
import { zpubToXpub } from "../../utils/other";
import { mobile } from "../../utils/media";
import {
  getP2shDeriationPathForNetwork,
  getP2wpkhDeriationPathForNetwork,
  getUnchainedNetworkFromBjslibNetwork,
} from "../../utils/files";

import { getAddressFromAccount } from "../../utils/accountMap";

import {
  white,
  gray300,
  gray500,
  gray700,
  gray900,
  green100,
  green700,
  green600,
} from "../../utils/colors";

import {
  HwiResponseEnumerate,
  ColdcardElectrumExport,
  File,
  AddressType,
  AccountConfig,
} from "../../types";

interface Props {
  header: JSX.Element;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  importedDevices: HwiResponseEnumerate[];
  setImportedDevices: React.Dispatch<
    React.SetStateAction<HwiResponseEnumerate[]>
  >;
  currentBitcoinNetwork: Network;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  setAddressType: React.Dispatch<React.SetStateAction<AddressType>>;
}

const NewHardwareWalletScreen = ({
  header,
  setStep,
  importedDevices,
  setImportedDevices,
  currentBitcoinNetwork,
  setPath,
  setAddressType,
}: Props) => {
  const [availableDevices, setAvailableDevices] = useState<
    HwiResponseEnumerate[]
  >([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);
  const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const importSingleSigDevice = async (
    device: HwiResponseEnumerate,
    index: number
  ) => {
    try {
      const p2wpkhXpub = await window.ipcRenderer.invoke("/xpub", {
        deviceType: device.type,
        devicePath: device.path,
        path: getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork), // we are assuming BIP48 P2WSH wallet
      }); // KBC-TODO: hwi xpub response type

      const p2wpkhConfig = {
        id: uuidv4(),
        created_at: 123,
        name: "test",
        network: "mainnet",
        addressType: AddressType.P2WPKH,
        quorum: {
          requiredSigners: 1,
          totalSigners: 1,
        },
        extendedPublicKeys: [
          {
            id: uuidv4(),
            created_at: Date.now(),
            parentFingerprint: device.fingerprint,
            network: "mainnet",
            bip32Path: getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork),
            xpub: p2wpkhXpub.xpub,
            device: {
              type: device.type,
              fingerprint: device.fingerprint,
              model: device.model,
            },
          },
        ],
      } as AccountConfig;

      const p2wpkhAddress = getAddressFromAccount(
        p2wpkhConfig,
        "m/0/0",
        currentBitcoinNetwork
      );

      let { data: p2wpkhTxs } = await axios.get(
        blockExplorerAPIURL(
          `/address/${p2wpkhAddress.address}/txs`,
          getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
        )
      );

      // check for P2SH(P2WPK) transactions too
      const p2shXpub = await window.ipcRenderer.invoke("/xpub", {
        deviceType: device.type,
        devicePath: device.path,
        path: getP2shDeriationPathForNetwork(currentBitcoinNetwork), // we are assuming BIP48 P2WSH wallet
      }); // KBC-TODO: hwi xpub response type

      const p2shConfig = {
        id: uuidv4(),
        created_at: 123,
        name: "test",
        network: "mainnet",
        addressType: AddressType.p2sh,
        quorum: {
          requiredSigners: 1,
          totalSigners: 1,
        },
        extendedPublicKeys: [
          {
            id: uuidv4(),
            created_at: Date.now(),
            parentFingerprint: device.fingerprint,
            network: "mainnet",
            bip32Path: getP2shDeriationPathForNetwork(currentBitcoinNetwork),
            xpub: p2shXpub.xpub,
            device: {
              type: device.type,
              fingerprint: device.fingerprint,
              model: device.model,
            },
          },
        ],
      } as AccountConfig;

      const p2shAddress = getAddressFromAccount(
        p2shConfig,
        "m/0/0",
        currentBitcoinNetwork
      );

      let { data: p2shTxs } = await axios.get(
        blockExplorerAPIURL(
          `/address/${p2shAddress.address}/txs`,
          getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
        )
      );

      if (p2shTxs.length && p2wpkhTxs.length) {
        openInModal(
          <ModalWrapper>
            <StyledIconCircle>
              <StyledIcon
                style={{ color: green600 }}
                as={CursorClick}
                size={36}
              />
            </StyledIconCircle>
            <ModalHeader>Select address type</ModalHeader>
            <ModalSubtext>
              We detected transaction history for two different address types
              with this device. Please choose which address type you would like
              to use.
            </ModalSubtext>
            <ButtonContainer>
              <SecondaryOptionButton
                data-cy="p2sh-button"
                color={gray700}
                background={white}
                onClick={() => {
                  setPath(
                    getP2shDeriationPathForNetwork(currentBitcoinNetwork)
                  );
                  setAddressType(AddressType.p2sh);
                  setImportedDevices([
                    ...importedDevices,
                    { ...device, ...p2shXpub },
                  ]);
                  closeModal();
                }}
              >
                P2SH(P2WPKH)
              </SecondaryOptionButton>
              <OptionButton
                data-cy="p2wpkh-button"
                color={white}
                background={green700}
                onClick={() => {
                  setPath(
                    getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork)
                  );
                  setAddressType(AddressType.P2WPKH);
                  setImportedDevices([
                    ...importedDevices,
                    { ...device, ...p2wpkhXpub },
                  ]);
                  closeModal();
                }}
              >
                P2WPKH
              </OptionButton>
            </ButtonContainer>
          </ModalWrapper>
        );
      } else if (p2shTxs.length) {
        setPath(getP2shDeriationPathForNetwork(currentBitcoinNetwork));
        setAddressType(AddressType.p2sh);
        setImportedDevices([...importedDevices, { ...device, ...p2shXpub }]);
      } else {
        setPath(getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork));
        setAddressType(AddressType.P2WPKH);
        setImportedDevices([...importedDevices, { ...device, ...p2wpkhXpub }]);
      }

      availableDevices.splice(index, 1);
      if (errorDevices.includes(device.fingerprint)) {
        const errorDevicesCopy = [...errorDevices];
        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
        setErrorDevices(errorDevicesCopy);
      }
      setAvailableDevices([...availableDevices]);
    } catch (e) {
      const errorDevicesCopy = [...errorDevices];
      errorDevicesCopy.push(device.fingerprint);
      setErrorDevices([...errorDevicesCopy]);
    }
  };

  const importDeviceFromFile = (parsedFile: ColdcardElectrumExport) => {
    try {
      if (parsedFile.keystore.derivation !== "m/49'/0'/0'") {
        throw new Error("Invalid file");
      }

      const xpub = zpubToXpub(decode(parsedFile.keystore.xpub));

      const newDevice = {
        type: parsedFile.keystore.hw_type,
        fingerprint: parsedFile.keystore.label.substring(
          "Coldcard Import ".length,
          parsedFile.keystore.label.length
        ),
        xpub: xpub,
        model: "unknown",
        path: "unknown",
      } as HwiResponseEnumerate;

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setStep(3);
    } catch (e) {
      openInModal(<ErrorModal message={e.message} closeModal={closeModal} />);
    }
  };

  const importDeviceFromQR = ({ data }: { data: string }) => {
    try {
      const { xfp, xpub, path } = JSON.parse(data);
      const xpubFromZpub = zpubToXpub(decode(xpub));

      const newDevice = {
        type: "cobo",
        fingerprint: xfp,
        xpub: xpubFromZpub,
        model: "unknown",
        path: path,
      } as HwiResponseEnumerate;

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setAvailableDevices([
        ...availableDevices.filter((item) => item.type !== "phone"),
      ]);
      closeModal();
    } catch (e) {
      openInModal(<ErrorModal message={e.message} closeModal={closeModal} />);
    }
  };

  return (
    <InnerWrapper>
      {header}
      <FormContainer>
        <BoxedWrapper>
          <FileUploader
            accept="*"
            id="localConfigFile"
            onFileLoad={({ file }: File) => {
              const parsedFile = JSON.parse(file);
              // TODO: should probably have better checking for files to make sure users aren't uploading "weird" files
              importDeviceFromFile(parsedFile);
            }}
          />

          <ImportFromFileLabel
            htmlFor="localConfigFile"
            ref={importDeviceFromFileRef}
          ></ImportFromFileLabel>

          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Connect hardware wallet to computer</SetupHeader>
                <SetupExplainerText>
                  Plug your hardware wallet into your computer and unlock it. If
                  you're using a Ledger, you will need to open the Bitcoin app
                  to access it. You can also add your hardware wallet like
                  Coldcard by importing the file from an SD card.
                </SetupExplainerText>
              </div>
              <Dropdown
                minimal={true}
                dropdownItems={[
                  {
                    label: "Import from File",
                    onClick: () => {
                      const importDeviceFromFile =
                        importDeviceFromFileRef.current;
                      if (importDeviceFromFile) {
                        importDeviceFromFile.click();
                      }
                    },
                  },
                  {
                    label: "Import from QR Code",
                    onClick: () =>
                      openInModal(
                        <BarcodeScannerComponent
                          // @ts-ignore
                          width={"100%"}
                          // @ts-ignore
                          height={"100%"}
                          onUpdate={(err, result) => {
                            if (result)
                              importDeviceFromQR({ data: result.getText() });
                            else return;
                          }}
                        />
                      ),
                  },
                ]}
              />
              {/* <ImportFromFileButton htmlFor="localConfigFile" background={white} color={darkGray}>Import from File</ImportFromFileButton> */}
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <DeviceSelect
            deviceAction={importSingleSigDevice}
            deviceActionText={"Click to Configure"}
            deviceActionLoadingText={"Configuring"}
            configuredDevices={importedDevices}
            unconfiguredDevices={availableDevices}
            errorDevices={errorDevices}
            setUnconfiguredDevices={setAvailableDevices}
            configuredThreshold={1}
          />
        </BoxedWrapper>
        {importedDevices.length > 0 && (
          <ContinueButton
            background={green600}
            color={white}
            onClick={() => {
              setStep(3);
            }}
          >
            Continue
          </ContinueButton>
        )}
      </FormContainer>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </InnerWrapper>
  );
};

const ContinueButton = styled.button`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  width: 100%;
`;

const ImportFromFileLabel = styled.label`
  display: none;
`;

const ModalWrapper = styled.div`
  padding: 1.5em;
  text-align: center;
`;

const ModalHeader = styled.h3`
  line-height: 1.5rem;
  font-size: 1.125em;
  color: ${gray900};
`;

const ModalSubtext = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
`;

const SecondaryOptionButton = styled.button`
  ${Button}
  border: 1px solid ${gray300};
  border-radius: 0.375em;
  flex: 1;
`;

const OptionButton = styled.button`
  ${Button}
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: grid;
  gap: 0.75rem;
  margin-top: 1.5em;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${mobile(css`
    display: block;
  `)}
`;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${green100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

export default NewHardwareWalletScreen;
