import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import bs58check from 'bs58check';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

import { Button, DeviceSelect, FileUploader, Dropdown, Modal } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';
import { zpubToXpub } from '../../utils/other';
import RequiredDevicesModal from './RequiredDevicesModal';

import { getMultisigDeriationPathForNetwork } from '../../utils/files';

const NewVaultScreen = ({
  header,
  setStep,
  importedDevices,
  setImportedDevices,
  setConfigRequiredSigners,
  configRequiredSigners,
  currentBitcoinNetwork
}) => {
  const [selectNumberRequiredModalOpen, setSelectNumberRequiredModalOpen] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [errorDevices, setErrorDevices] = useState([]);
  const [otherImportDropdownOpen, setOtherImportDropdownOpen] = useState(false);
  const [qrScanModalOpen, setQrScanModalOpen] = useState(false);

  const importDeviceFromFileRef = useRef(null);

  const importMultisigDevice = async (device, index) => {
    try {
      const response = await window.ipcRenderer.invoke('/xpub', {
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
      setErrorDevices([...errorDevicesCopy])
    }
  }

  const importDeviceFromQR = ({ data }) => {
    try {
      const [parentFingerprint, xpub] = data.split(':');

      const newDevice = {
        type: 'phone',
        fingerprint: parentFingerprint,
        xpub: xpub
      }

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setAvailableDevices([...availableDevices.filter((item) => item.type !== 'phone')]);
      setQrScanModalOpen(false);
    } catch (e) {

    }
  }

  // TODO: look at the difference between singleSig and multisigExport files
  const importDeviceFromFile = (parsedFile) => {
    const zpub = bs58check.decode(parsedFile.p2wsh);
    const xpub = zpubToXpub(zpub);

    const newDevice = {
      type: 'coldcard',
      fingerprint: parsedFile.xfp,
      xpub: xpub
    }

    const updatedImportedDevices = [...importedDevices, newDevice];
    setImportedDevices(updatedImportedDevices)
  }

  const importMultisigWalletFromFile = (parsedFile) => {
    const numPubKeys = Object.keys(parsedFile).filter((key) => key.startsWith('x')).length // all exports start with x
    const devicesFromFile = [];

    for (let i = 1; i < numPubKeys + 1; i++) {
      const zpub = bs58check.decode(parsedFile[`x${i}/`].xpub);
      const xpub = zpubToXpub(zpub);

      const newDevice = {
        type: parsedFile[`x${i}/`].hw_type,
        fingerprint: parsedFile[`x${i}/`].label.substring(parsedFile[`x${i}/`].label.indexOf('Coldcard ') + 'Coldcard '.length),
        xpub: xpub
      };

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
            onFileLoad={({ file }) => {
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
              width={'100%'}
              height={'100%'}
              onUpdate={(err, result) => {
                if (result) importDeviceFromQR({ data: result.text })
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
                      importDeviceFromFile.click()
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
          onClick={() => {
            // if (importedDevices.length === 1) {
            //   setStep(3);
            // } else {
            setSelectNumberRequiredModalOpen(true)
            // }
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

const ContinueButton = styled.div`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`;

const ImportFromFileLabel = styled.label`
  display: none;
`;

export default NewVaultScreen;