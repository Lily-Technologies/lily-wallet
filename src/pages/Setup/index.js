import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AES } from 'crypto-js';
import moment from 'moment';

import bs58check from 'bs58check';
import { generateMnemonic } from "bip39";

import { createMultisigConfigFile, createSinglesigConfigFile, createSinglesigHWWConfigFile, createColdCardBlob, downloadFile, containsColdcard } from '../../utils/files';
import { black } from '../../utils/colors';

import StepGroups from './Steps';
import PageHeader from './PageHeader';
import SelectAccountScreen from './SelectAccountScreen';
import InputPasswordScreen from './InputPasswordScreen';
import InputNameScreen from './InputNameScreen';
import NewVaultScreen from './NewVaultScreen';
import SuccessScreen from './SuccessScreen';
import NewWalletScreen from './NewWalletScreen';
import NewHardwareWalletScreen from './NewHardwareWalletScreen';

const Setup = ({ config, setConfigFile, currentBitcoinNetwork }) => {
  document.title = `New Account - Lily Wallet`;
  const [setupOption, setSetupOption] = useState(0);
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [importedDevices, setImportedDevices] = useState([]);
  const [password, setPassword] = useState('');
  const [walletMnemonic, setWalletMnemonic] = useState(null);
  const [configRequiredSigners, setConfigRequiredSigners] = useState(1);

  useEffect(() => {
    setWalletMnemonic(generateMnemonic(256));
  }, []);


  const exportSetupFiles = async () => {
    let configObject;
    if (setupOption === 1) {
      configObject = await createMultisigConfigFile(importedDevices, configRequiredSigners, accountName, config, currentBitcoinNetwork);
      if (containsColdcard(importedDevices)) {
        const ccFile = createColdCardBlob(configRequiredSigners, importedDevices.length, accountName, importedDevices);
        await downloadFile(ccFile, `${accountName}-lily-coldcard-file-${moment().format('MMDDYYYY')}.txt`);
      }
    } else if (setupOption === 2) {
      configObject = await createSinglesigConfigFile(walletMnemonic, accountName, config, currentBitcoinNetwork);
    } else {
      configObject = await createSinglesigHWWConfigFile(importedDevices[0], accountName, config, currentBitcoinNetwork)
    }

    const encryptedConfigObject = AES.encrypt(JSON.stringify(configObject), password).toString();
    const encryptedConfigFile = new Blob([decodeURIComponent(encodeURI(encryptedConfigObject))], { type: "text/plain;charset=utf-8;" });
    await downloadFile(encryptedConfigFile, `lily_wallet_config-${moment().format('MMDDYY-hhmmss')}.txt`)
    setConfigFile(configObject);
  }

  const Header = (
    <PageHeader
      config={config}
      headerText={(step === 0) ? 'Select account type' : `${setupOption === 2 ? 'Create new wallet' : setupOption === 3 ? 'Manage hardware wallet' : 'Create new vault'}`}
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
    case 2:
      if (setupOption === 2) {
        screen = <NewWalletScreen
          header={Header}
          config={config}
          walletMnemonic={walletMnemonic}
          setWalletMnemonic={setWalletMnemonic}
          setStep={setStep}
        />;
      } else if (setupOption === 3) {
        screen = <NewHardwareWalletScreen
          header={Header}
          config={config}
          setStep={setStep}
          importedDevices={importedDevices}
          setImportedDevices={setImportedDevices}
        />;
      } else {
        screen = <NewVaultScreen
          header={Header}
          config={config}
          setStep={setStep}
          importedDevices={importedDevices}
          setImportedDevices={setImportedDevices}
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
  color: ${ black};
  // margin-top: -1px;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: ${ p => p.step === 0 ? 'center' : 'flex-start'};
  flex-direction: column;
  // padding-top: 50px;
  `;

export default Setup;