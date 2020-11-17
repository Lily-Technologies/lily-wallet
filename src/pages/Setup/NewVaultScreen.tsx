import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { decode } from 'bs58check';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { Network } from 'bitcoinjs-lib';

import { Button, DeviceSelect, FileUploader, Dropdown, Modal } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';
import { zpubToXpub } from '../../utils/other';
import RequiredDevicesModal from './RequiredDevicesModal';

import { white, green600 } from '../../utils/colors'

import { getMultisigDeriationPathForNetwork } from '../../utils/files';

import { HwiResponseEnumerate, File, ColdcardDeviceMultisigExportFile, ColdcardMultisigExportFile } from '../../types';

interface Props {
  header: JSX.Element
  setStep: React.Dispatch<React.SetStateAction<number>>
  importedDevices: HwiResponseEnumerate[]
  setImportedDevices: React.Dispatch<React.SetStateAction<HwiResponseEnumerate[]>>
  setConfigRequiredSigners: React.Dispatch<React.SetStateAction<number>>
  configRequiredSigners: number
  currentBitcoinNetwork: Network
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
  const [selectNumberRequiredModalOpen, setSelectNumberRequiredModalOpen] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<HwiResponseEnumerate[]>([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);
  const [otherImportDropdownOpen, setOtherImportDropdownOpen] = useState(false);
  const [qrScanModalOpen, setQrScanModalOpen] = useState(false);

  const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);

  const importMultisigDevice = async (device: HwiResponseEnumerate, index: number) => {
    try {
      const response = await window.ipcRenderer.invoke('/xpub', {
        deviceType: device.type,
        devicePath: device.path,
        path: getMultisigDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
      }); // KBC-TODO: add type for HwiXpubResponse

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
      setErrorDevices([...errorDevicesCopy])
    }
  }

  // data comes in as (n/m):somedata1wq42rsdsa
  const importDeviceFromQR = ({ data }: { data: string }) => {
    try {
      const [parentFingerprint, xpub] = data.split(':');

      const newDevice = {
        type: 'phone',
        fingerprint: parentFingerprint,
        xpub: xpub,
        model: 'unknown',
        path: 'unknown'
      } as HwiResponseEnumerate;

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setAvailableDevices([...availableDevices.filter((item) => item.type !== 'phone')]);
      setQrScanModalOpen(false);
    } catch (e) {

    }
  }

  // TODO: look at the difference between singleSig and multisigExport files
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
    setImportedDevices(updatedImportedDevices)
  }

  const importMultisigWalletFromFile = (parsedFile: ColdcardMultisigExportFile) => {
    const numPubKeys = Object.keys(parsedFile).filter((key) => key.startsWith('x')).length // all exports start with x
    const devicesFromFile = [];

    for (let i = 1; i < numPubKeys + 1; i++) {
      const zpub = decode(parsedFile[`x${i}/`].xpub);
      const xpub = zpubToXpub(zpub);

      const newDevice = {
        type: parsedFile[`x${i}/`].hw_type,
        fingerprint: parsedFile[`x${i}/`].label.substring(parsedFile[`x${i}/`].label.indexOf('Coldcard ') + 'Coldcard '.length),
        xpub: xpub,
        model: 'unknown',
        path: 'none'
      } as HwiResponseEnumerate;

      devicesFromFile.push(newDevice);
    }
    const updatedImportedDevices = [...importedDevices, ...devicesFromFile];
    setImportedDevices(updatedImportedDevices)
  }

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
              if (parsedFile.seed_version) { // is a multisig file
                importMultisigWalletFromFile(parsedFile)
              } else { // is a wallet export file
                importDeviceFromFile(parsedFile)
              }
            }}
          />
          <ImportFromFileLabel htmlFor="localConfigFile" ref={importDeviceFromFileRef}></ImportFromFileLabel>

          <Modal
            isOpen={qrScanModalOpen}
            onRequestClose={() => setQrScanModalOpen(false)}
          >
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result) importDeviceFromQR({ data: result.getText() })
                else return;
              }}
            />
          </Modal>

          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Connect Devices to Computer</SetupHeader>
                <SetupExplainerText>
                  Devices unlocked and connected to your computer will appear here. Click on them to include them in your vault.
                  You may disconnect a device from your computer after it has been imported.
                  </SetupExplainerText>
              </div>
              <Dropdown
                isOpen={otherImportDropdownOpen}
                setIsOpen={setOtherImportDropdownOpen}
                minimal={true}
                buttonLabel={'Other Import Options'}
                dropdownItems={[
                  {
                    label: "Import from File",
                    onClick: () => {
                      const importDeviceFromFile = importDeviceFromFileRef.current;
                      if (importDeviceFromFile) {
                        importDeviceFromFile.click()
                      }
                    }
                  },
                  {
                    label: "Import from QR Code",
                    onClick: () => setQrScanModalOpen(true)
                  }
                ]}
              />

            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <DeviceSelect
            deviceAction={importMultisigDevice}
            phoneAction={() => setQrScanModalOpen(true)}
            deviceActionText={'Click to Configure'}
            deviceActionLoadingText={'Extracting XPub'}
            configuredDevices={importedDevices}
            unconfiguredDevices={availableDevices}
            errorDevices={errorDevices}
            setUnconfiguredDevices={setAvailableDevices}
            configuredThreshold={15}
          />
        </BoxedWrapper>
        {importedDevices.length > 1 && <ContinueButton
          background={green600}
          color={white}
          onClick={() => {
            setSelectNumberRequiredModalOpen(true)
          }}>Finish Adding Devices</ContinueButton>}
      </FormContainer>

      <RequiredDevicesModal
        selectNumberRequiredModalOpen={selectNumberRequiredModalOpen}
        setSelectNumberRequiredModalOpen={setSelectNumberRequiredModalOpen}
        numberOfImportedDevices={importedDevices.length}
        setConfigRequiredSigners={setConfigRequiredSigners}
        configRequiredSigners={configRequiredSigners}
        setStep={setStep}
      />
    </InnerWrapper>
  )
}

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