import React, { useState } from 'react';
import styled from 'styled-components';
import bs58check from 'bs58check';
import { Network } from 'bitcoinjs-lib';

import { Button, DeviceSelect, FileUploader } from '../../components';
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';
import { darkGray, white } from '../../utils/colors';
import { zpubToXpub } from '../../utils/other';
import { getP2shDeriationPathForNetwork } from '../../utils/files';

import { green600 } from '../../utils/colors';

import { HwiResponseEnumerate, ColdcardDeviceMultisigExportFile, File } from '../../types';

interface Props {
  header: JSX.Element
  setStep: React.Dispatch<React.SetStateAction<number>>
  importedDevices: HwiResponseEnumerate[]
  setImportedDevices: React.Dispatch<React.SetStateAction<HwiResponseEnumerate[]>>
  currentBitcoinNetwork: Network
}

const NewHardwareWalletScreen = ({
  header,
  setStep,
  importedDevices,
  setImportedDevices,
  currentBitcoinNetwork
}: Props) => {
  const [availableDevices, setAvailableDevices] = useState<HwiResponseEnumerate[]>([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);

  const importSingleSigDevice = async (device: HwiResponseEnumerate, index: number) => {
    try {
      const response = await window.ipcRenderer.invoke('/xpub', {
        deviceType: device.type,
        devicePath: device.path,
        path: getP2shDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
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
      setErrorDevices([...errorDevicesCopy])
    }
  }

  // KBC-TODO: this doesn't work...we need to accept a singlesig coldcard file as input
  // Example Input:
  // {
  //   "keystore": {
  //     "ckcc_xpub": "xpub661MyMwAqRbcFY3rSS8qE89xuc8g3ZkKbfVT7t3DPpomRASfjeWMbYSTTnxUTXcTdu73MEZCXmzv8ravVjvq8aC9jM4ZaM1BiD46",
  //     "xpub": "ypub6X1iLoC66mvtA1zigXwTSbLrFpBp9iFcDcgb9GBcPryy3vn52QtumoJwA9ykpJy5oAQEuPCuRYvxz9qjymDiucZ5fgEwNAeBMB",
  //     "label": "Coldcard Import 4F60D1C9",
  //     "ckcc_xfp": 3385942095,
  //     "type": "hardware",
  //     "hw_type": "coldcard",
  //     "derivation": "m/49'/0'/0'"
  //   },
  //   "wallet_type": "standard",
  //   "use_encryption": false,
  //   "seed_version": 17
  // }
  const importDeviceFromFile = (parsedFile: ColdcardDeviceMultisigExportFile) => {
    console.log('parsedFile: ', parsedFile);
    const zpub = bs58check.decode(parsedFile.p2wsh);
    const xpub = zpubToXpub(zpub);

    const newDevice = {
      type: 'coldcard',
      fingerprint: parsedFile.xfp,
      xpub: xpub,
      model: 'unknown',
      path: 'unknown'
    } as HwiResponseEnumerate;

    const updatedImportedDevices = [...importedDevices, newDevice];
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
              importDeviceFromFile(parsedFile)
            }}
          />

          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Connect hardware wallet to computer</SetupHeader>
                <SetupExplainerText>
                  Plug your hardware wallet into your computer and unlock it. If you're using a Ledger, you will need to open the Bitcoin app to access it.
                  You can also add your hardware wallet like Coldcard by importing the file from an SD card.
                  </SetupExplainerText>
              </div>
              <ImportFromFileButton htmlFor="localConfigFile" background={white} color={darkGray}>Import from File</ImportFromFileButton>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <DeviceSelect
            deviceAction={importSingleSigDevice}
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
            setStep(3);
          }}>Continue</ContinueButton>}
      </FormContainer>
    </InnerWrapper>
  )
}

const ContinueButton = styled.button`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`;

const ImportFromFileButton = styled.label`
  ${Button}
  font-size: 0.75em;
  border: 1px solid ${darkGray};
`;

export default NewHardwareWalletScreen;