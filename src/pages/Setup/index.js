import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AES } from 'crypto-js';

import bs58check from 'bs58check';
import { generateMnemonic } from "bip39";

import { createMultisigConfigFile, createSinglesigConfigFile, createSinglesigHWWConfigFile, createColdCardBlob, downloadFile, formatFilename } from '../../utils/files';
import { black } from '../../utils/colors';

import StepGroups from './Steps';
import PageHeader from './PageHeader';
import SelectAccountScreen from './SelectAccountScreen';
import InputPasswordScreen from './InputPasswordScreen';
import InputNameScreen from './InputNameScreen';
import NewVaultScreen from './NewVaultScreen';
import SuccessScreen from './SuccessScreen';
import NewWalletScreen from './NewWalletScreen';

const zpubToXpub = (zpub) => {
  const zpubRemovedPrefix = zpub.slice(4);
  const xpubBuffer = Buffer.concat([Buffer.from('0488b21e', 'hex'), zpubRemovedPrefix]);
  const xpub = bs58check.encode(xpubBuffer);
  return xpub
}

const Setup = ({ config, setConfigFile, currentBitcoinNetwork }) => {
  const [setupOption, setSetupOption] = useState(0);
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [importedDevices, setImportedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [errorDevices, setErrorDevices] = useState([]);
  const [password, setPassword] = useState('');
  const [walletMnemonic, setWalletMnemonic] = useState(null);
  const [configRequiredSigners, setConfigRequiredSigners] = useState(1);

  useEffect(() => {
    setWalletMnemonic(generateMnemonic(256));
  }, []);

  document.title = `Create Files - Lily Wallet`;

  const importMultisigDevice = async (device, index) => {
    try {
      const response = await window.ipcRenderer.invoke('/xpub', {
        deviceType: device.type,
        devicePath: device.path,
        path: `m/48'/0'/0'/2'` // we are assuming BIP48 P2WSH wallet
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

  const importSingleSigDevice = async (device, index) => {
    try {
      const response = await window.ipcRenderer.invoke('/xpub', {
        deviceType: device.type,
        devicePath: device.path,
        path: `m/49'/0'/0'` // we are assuming BIP48 P2WSH wallet
      });

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

  // TODO: eventually support this for single hww implementations
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
    setImportedDevices([...importedDevices, ...devicesFromFile])
  }

  const exportSetupFiles = async () => {
    if (setupOption === 2) {
      await exportSetupFilesSingleSig()
    } else {
      await exportSetupFilesMultisig()
    }
  }

  const exportSetupFilesSingleSig = async () => {
    const contentType = "text/plain;charset=utf-8;";
    let configObject;
    if (importedDevices.length) {
      configObject = await createSinglesigHWWConfigFile(importedDevices[0], accountName, config, currentBitcoinNetwork)
    } else {
      configObject = await createSinglesigConfigFile(walletMnemonic, accountName, config, currentBitcoinNetwork);
    }

    const encryptedConfigObject = AES.encrypt(
      JSON.stringify(configObject),
      password
    ).toString();

    const encryptedConfigFile = new Blob(
      [decodeURIComponent(encodeURI(encryptedConfigObject))],
      { type: contentType }
    );
    downloadFile(
      encryptedConfigFile,
      formatFilename('lily_wallet_config', currentBitcoinNetwork, 'txt')
    );

    setConfigFile(configObject);
  };

  const exportSetupFilesMultisig = async () => {
    const contentType = "text/plain;charset=utf-8;";

    const ccFile = createColdCardBlob(configRequiredSigners, importedDevices.length, accountName, importedDevices);
    const configObject = createMultisigConfigFile(importedDevices, configRequiredSigners, accountName, config, currentBitcoinNetwork);
    const encryptedConfigObject = AES.encrypt(JSON.stringify(configObject), password).toString();
    const encryptedConfigFile = new Blob([decodeURIComponent(encodeURI(encryptedConfigObject))], { type: contentType });

    downloadFile(ccFile, formatFilename(`${accountName}-lily-coldcard-file`, currentBitcoinNetwork, 'txt'));
    // KBC-TODO: electron-dl bug requires us to wait for the first file to finish downloading before downloading the second
    // this should be fixed somehow
    setTimeout(() => {
      downloadFile(encryptedConfigFile, formatFilename('lily_wallet_config', currentBitcoinNetwork, 'txt'))
    }, 500);
    setConfigFile(configObject);
  }

  const Header = (
    <PageHeader
      config={config}
      headerText={(step === 0) ? 'Select account type' : `Create new ${setupOption === 2 ? 'wallet' : 'vault'}`}
      setStep={setStep}
      step={step}
    />
  )

  let screen = null;

  switch (step) {
    case 0:
      screen = <SelectAccountScreen
        header={Header}
        config={config}
        setSetupOption={setSetupOption}
        setStep={setStep} />;
      break;
    case 1:
      screen = <InputNameScreen
        header={Header}
        config={config}
        setupOption={setupOption}
        setStep={setStep}
        accountName={accountName}
        setAccountName={setAccountName} />;
      break;
    // case 5:
    //   screen = <SelectWalletTypeScreen
    //     setStep={setStep}
    //     config={config}
    //   />
    //   break;
    case 2:
      if (setupOption === 2) {
        screen = <NewWalletScreen
          header={Header}
          config={config}
          walletMnemonic={walletMnemonic}
          setWalletMnemonic={setWalletMnemonic}
          setStep={setStep}
          importedDevices={importedDevices}
          availableDevices={availableDevices}
          setAvailableDevices={setAvailableDevices}
          errorDevices={errorDevices}
          importDevice={importSingleSigDevice}
        />;
      } else {
        screen = <NewVaultScreen
          header={Header}
          config={config}
          setStep={setStep}
          importMultisigWalletFromFile={importMultisigWalletFromFile}
          importDeviceFromFile={importDeviceFromFile}
          importDevice={importMultisigDevice}
          importedDevices={importedDevices}
          availableDevices={availableDevices}
          errorDevices={errorDevices}
          setAvailableDevices={setAvailableDevices}
          setConfigRequiredSigners={setConfigRequiredSigners}
          configRequiredSigners={configRequiredSigners}
        />;
      }
      break;
    case 3:
      screen = <InputPasswordScreen
        header={Header}
        config={config}
        setupOption={setupOption}
        password={password}
        setPassword={setPassword}
        setStep={setStep}
      />;
      break;
    case 4:
      screen = <SuccessScreen
        exportSetupFiles={exportSetupFiles}
      />;
      break;
    default:
      screen = <div>Unexpected error</div>;
  }

  return (
    <Wrapper step={step}>
      {step > 0 && <StepGroups step={step} setupOption={setupOption} />}
      {screen}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  // padding: 1em;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  // margin-top: -1px;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: ${p => p.step === 0 ? 'center' : 'flex-start'};
  flex-direction: column;
  // padding-top: 50px;
`;

export default Setup;