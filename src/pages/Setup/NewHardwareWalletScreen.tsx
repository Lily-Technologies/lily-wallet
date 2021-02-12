import React, { useState, useRef } from "react";
import styled from "styled-components";
import { decode } from "bs58check";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { Network } from "bitcoinjs-lib";

import {
  Button,
  DeviceSelect,
  FileUploader,
  Dropdown,
  ErrorModal,
  Modal,
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
import { white } from "../../utils/colors";
import { zpubToXpub } from "../../utils/other";
import { getP2shDeriationPathForNetwork } from "../../utils/files";

import { green600 } from "../../utils/colors";

import {
  HwiResponseEnumerate,
  ColdcardElectrumExport,
  File,
} from "../../types";

interface Props {
  header: JSX.Element;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  importedDevices: HwiResponseEnumerate[];
  setImportedDevices: React.Dispatch<
    React.SetStateAction<HwiResponseEnumerate[]>
  >;
  currentBitcoinNetwork: Network;
}

const NewHardwareWalletScreen = ({
  header,
  setStep,
  importedDevices,
  setImportedDevices,
  currentBitcoinNetwork,
}: Props) => {
  const [availableDevices, setAvailableDevices] = useState<
    HwiResponseEnumerate[]
  >([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);
  const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);
  const [otherImportDropdownOpen, setOtherImportDropdownOpen] = useState(false);
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
      const response = await window.ipcRenderer.invoke("/xpub", {
        deviceType: device.type,
        devicePath: device.path,
        path: getP2shDeriationPathForNetwork(currentBitcoinNetwork), // we are assuming BIP48 P2WSH wallet
      }); // KBC-TODO: hwi xpub response type

      setImportedDevices([...importedDevices, { ...device, ...response }]);
      availableDevices.splice(index, 1);
      if (errorDevices.includes(device.fingerprint)) {
        const errorDevicesCopy = [...errorDevices];
        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
        setErrorDevices(errorDevicesCopy);
      }
      setAvailableDevices([...availableDevices]);

      setStep(3);
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
      openInModal(<ErrorModal message={e.message} />);
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
      openInModal(<ErrorModal message={e.message} />);
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
                isOpen={otherImportDropdownOpen}
                setIsOpen={setOtherImportDropdownOpen}
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
            deviceActionLoadingText={"Extracting XPub"}
            configuredDevices={importedDevices}
            unconfiguredDevices={availableDevices}
            errorDevices={errorDevices}
            setUnconfiguredDevices={setAvailableDevices}
            configuredThreshold={15}
          />
        </BoxedWrapper>
        {importedDevices.length > 1 && (
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
`;

const ImportFromFileLabel = styled.label`
  display: none;
`;

export default NewHardwareWalletScreen;
