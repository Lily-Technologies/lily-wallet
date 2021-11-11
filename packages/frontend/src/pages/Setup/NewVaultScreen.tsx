import React, { useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import { decode } from 'bs58check';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import { Network } from 'bitcoinjs-lib';

import { Button, DeviceSelect, FileUploader, Dropdown, Modal, ErrorModal } from 'src/components';

import {
  InnerWrapper,
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  SetupExplainerText,
  FormContainer,
  BoxedWrapper,
  SetupHeader
} from './styles';

import RequiredDevicesModal from './RequiredDevicesModal';
import InputXpubModal from './InputXpubModal';

import { white, green600 } from 'src/utils/colors';

import { getMultisigDeriationPathForNetwork } from 'src/utils/files';
import { zpubToXpub } from 'src/utils/other';

import { PlatformContext } from 'src/context';

import {
  HwiResponseEnumerate,
  File,
  ColdcardDeviceMultisigExportFile,
  ColdcardMultisigExportFile
} from '@lily/types';

interface Props {
  header: JSX.Element;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  importedDevices: HwiResponseEnumerate[];
  setImportedDevices: React.Dispatch<React.SetStateAction<HwiResponseEnumerate[]>>;
  setConfigRequiredSigners: React.Dispatch<React.SetStateAction<number>>;
  configRequiredSigners: number;
  currentBitcoinNetwork: Network;
}

const NewVaultScreen = ({
  header,
  setStep,
  importedDevices,
  setImportedDevices,
  setConfigRequiredSigners,
  configRequiredSigners,
  currentBitcoinNetwork
}: Props) => {
  const [availableDevices, setAvailableDevices] = useState<HwiResponseEnumerate[]>([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const { platform } = useContext(PlatformContext);

  const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const importMultisigDevice = async (device: HwiResponseEnumerate, index: number) => {
    try {
      const response = await platform.getXpub({
        deviceType: device.type,
        devicePath: device.path,
        path: getMultisigDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
      });

      setImportedDevices([...importedDevices, { ...device, ...response }]);
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

  const importDeviceFromQR = ({ data }: { data: string }) => {
    try {
      const { xfp, xpub, path, lilyMobile } = JSON.parse(data);

      let newDevice: HwiResponseEnumerate;
      if (lilyMobile) {
        newDevice = {
          type: 'phone',
          fingerprint: xfp,
          xpub: xpub,
          model: 'unknown',
          path: path
        };
      } else {
        const xpubFromZpub = zpubToXpub(decode(xpub));
        newDevice = {
          type: 'cobo',
          fingerprint: xfp,
          xpub: xpubFromZpub,
          model: 'unknown',
          path: path
        };
      }

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setAvailableDevices([...availableDevices.filter((item) => item.type !== 'phone')]);
      closeModal();
    } catch (e) {}
  };

  const importDeviceFromFile = (parsedFile: ColdcardDeviceMultisigExportFile) => {
    const zpub = decode(parsedFile.p2wsh);
    const xpub = zpubToXpub(zpub);

    const newDevice = {
      type: 'coldcard',
      fingerprint: parsedFile.xfp,
      xpub: xpub,
      path: 'unknown',
      model: 'unknown'
    } as HwiResponseEnumerate;

    const updatedImportedDevices = [...importedDevices, newDevice];
    setImportedDevices(updatedImportedDevices);
  };

  const importMultisigWalletFromFile = (parsedFile: ColdcardMultisigExportFile) => {
    const numPubKeys = Object.keys(parsedFile).filter((key) => key.startsWith('x')).length; // all exports start with x
    const devicesFromFile: HwiResponseEnumerate[] = [];

    for (let i = 1; i < numPubKeys + 1; i++) {
      const zpub = decode(parsedFile[`x${i}/`].xpub);
      const xpub = zpubToXpub(zpub);

      const newDevice = {
        type: parsedFile[`x${i}/`].hw_type,
        fingerprint: parsedFile[`x${i}/`].label.substring(
          parsedFile[`x${i}/`].label.indexOf('Coldcard ') + 'Coldcard '.length
        ),
        xpub: xpub,
        model: 'unknown',
        path: 'none'
      } as HwiResponseEnumerate;

      devicesFromFile.push(newDevice);
    }
    const updatedImportedDevices = [...importedDevices, ...devicesFromFile];
    setImportedDevices(updatedImportedDevices);
  };

  return (
    <InnerWrapper>
      {header}
      <FormContainer>
        <BoxedWrapper>
          <FileUploader
            accept='application/JSON'
            id='localConfigFile'
            onFileLoad={({ file }: File) => {
              try {
                const parsedFile = JSON.parse(file);
                if (parsedFile.seed_version) {
                  // is a multisig file
                  importMultisigWalletFromFile(parsedFile);
                } else {
                  // is a wallet export file
                  importDeviceFromFile(parsedFile);
                }
              } catch (e) {
                openInModal(<ErrorModal message='Invalid file' closeModal={closeModal} />);
              }
            }}
          />
          <ImportFromFileLabel
            htmlFor='localConfigFile'
            ref={importDeviceFromFileRef}
          ></ImportFromFileLabel>

          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Connect devices to computer</SetupHeader>
                <SetupExplainerText>
                  Devices unlocked and connected to your computer will appear here. Click on them to
                  include them in your vault. You may disconnect a device from your computer after
                  it has been imported.
                </SetupExplainerText>
              </div>
              <Dropdown
                minimal={true}
                data-cy='advanced-import-dropdown'
                dropdownItems={[
                  {
                    label: 'Import from File',
                    onClick: () => {
                      const importDeviceFromFile = importDeviceFromFileRef.current;
                      if (importDeviceFromFile) {
                        importDeviceFromFile.click();
                      }
                    }
                  },
                  {
                    label: 'Import from QR Code',
                    onClick: () =>
                      openInModal(
                        <BarcodeScannerComponent
                          // @ts-ignore
                          width={'100%'}
                          onUpdate={(err, result) => {
                            if (result) importDeviceFromQR({ data: result.getText() });
                            else return;
                          }}
                        />
                      )
                  },
                  {
                    label: 'Manually add device',
                    onClick: () =>
                      openInModal(
                        <InputXpubModal
                          importedDevices={importedDevices}
                          setImportedDevices={setImportedDevices}
                          closeModal={closeModal}
                        />
                      )
                  }
                ]}
              />
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <DeviceSelect
            deviceAction={importMultisigDevice}
            deviceActionText={'Click to Configure'}
            deviceActionLoadingText={'Configuring'}
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
              openInModal(
                <RequiredDevicesModal
                  numberOfImportedDevices={importedDevices.length}
                  setConfigRequiredSigners={setConfigRequiredSigners}
                  configRequiredSigners={configRequiredSigners}
                  setStep={setStep}
                  closeModal={closeModal}
                />
              );
            }}
          >
            Finish adding devices
          </ContinueButton>
        )}
      </FormContainer>
      <Modal
        isOpen={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        style={{ content: { overflow: 'inherit' } }}
      >
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

export default NewVaultScreen;
