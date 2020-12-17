import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { generateMnemonic } from "bip39";
import { Network } from 'bitcoinjs-lib';

import { createMultisigConfigFile, createSinglesigConfigFile, createSinglesigHWWConfigFile, createColdCardBlob, downloadFile, saveConfig, containsColdcard } from '../../utils/files';
import { black } from '../../utils/colors';

import StepGroups from './Steps';
import PageHeader from './PageHeader';
import SelectAccountScreen from './SelectAccountScreen';
import InputNameScreen from './InputNameScreen';
import NewVaultScreen from './NewVaultScreen';
import SuccessScreen from './SuccessScreen';
import NewWalletScreen from './NewWalletScreen';
import NewHardwareWalletScreen from './NewHardwareWalletScreen';

import { LilyConfig, HwiResponseEnumerate, ExtendedPublicKey } from '../../types';

interface Props {
  config: LilyConfig
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>
  password: string
  currentBitcoinNetwork: Network
}

const Setup = ({ config, setConfigFile, password, currentBitcoinNetwork }: Props) => {
  document.title = `Setup - Lily Wallet`;
  const [setupOption, setSetupOption] = useState(0);
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [importedDevices, setImportedDevices] = useState<HwiResponseEnumerate[]>([]);
  const [walletMnemonic, setWalletMnemonic] = useState('');
  const [configRequiredSigners, setConfigRequiredSigners] = useState(1);
  const [localConfig, setLocalConfig] = useState(config);

  const exportSetupFiles = useCallback(async () => {
    let configObject;
    if (setupOption === 1) {
      configObject = await createMultisigConfigFile(importedDevices, configRequiredSigners, accountName, config, currentBitcoinNetwork);
    } else if (setupOption === 2) {
      configObject = await createSinglesigConfigFile(walletMnemonic, accountName, config, currentBitcoinNetwork);
    } else {
      configObject = await createSinglesigHWWConfigFile(importedDevices[0], accountName, config, currentBitcoinNetwork)
    }
    saveConfig(configObject, password);
    setLocalConfig(configObject);
  }, [accountName, config, configRequiredSigners, currentBitcoinNetwork, importedDevices, password, setupOption, walletMnemonic]);

  const downloadColdcardFile = async () => {
    if (containsColdcard(importedDevices)) {
      const devicesForCCFile = importedDevices.map((device) => { // KBC-TODO: this is a hack to get the cc function to work
        return {
          id: 'abc123',
          created_at: 1231006505,
          parentFingerprint: 'abc123',
          network: 'mainnet',
          bip32Path: 'abc123',
          xpub: 'abcs123',
          device: device
        } as ExtendedPublicKey
      })


      const ccFile = createColdCardBlob(configRequiredSigners, importedDevices.length, accountName, devicesForCCFile, currentBitcoinNetwork);
      await downloadFile(ccFile, `${accountName}-lily-coldcard-file-${moment().format('MMDDYYYY')}.txt`);
    }
  }

  useEffect(() => {
    setWalletMnemonic(generateMnemonic(256));
  }, []);

  useEffect(() => {
    if (step === 3) {
      exportSetupFiles();
    }

    return () => {
      if (step === 3) {
        setConfigFile({ ...localConfig })
      }
    }
  }, [step]); // eslint-disable-line


  const Header = (
    <PageHeader
      headerText={(step === 0) ? 'Select account type' : `${setupOption === 2 ? 'Create new wallet' : setupOption === 3 ? 'Manage hardware wallet' : 'Create new vault'}`}
      setStep={setStep}
      step={step}
      setSetupOption={setSetupOption}
    />
  )

  let screen = null;

  switch (step) {
    case 0:
      screen = <SelectAccountScreen
        header={Header}
        setSetupOption={setSetupOption}
        setStep={setStep} />;
      break;
    case 1:
      screen = <InputNameScreen
        header={Header}
        setupOption={setupOption}
        setStep={setStep}
        accountName={accountName}
        setAccountName={setAccountName} />;
      break;
    case 2:
      if (setupOption === 2) {
        screen = <NewWalletScreen
          header={Header}
          walletMnemonic={walletMnemonic}
          setStep={setStep}
        />;
      } else if (setupOption === 3) {
        screen = <NewHardwareWalletScreen
          header={Header}
          setStep={setStep}
          importedDevices={importedDevices}
          setImportedDevices={setImportedDevices}
          currentBitcoinNetwork={currentBitcoinNetwork}
        />;
      } else {
        screen = <NewVaultScreen
          header={Header}
          setStep={setStep}
          importedDevices={importedDevices}
          setImportedDevices={setImportedDevices}
          setConfigRequiredSigners={setConfigRequiredSigners}
          configRequiredSigners={configRequiredSigners}
          currentBitcoinNetwork={currentBitcoinNetwork}
        />;
      }
      break;
    case 3:
      screen = <SuccessScreen
        config={localConfig}
        downloadColdcardFile={containsColdcard(importedDevices) && importedDevices.length > 1 ? downloadColdcardFile : undefined}
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

const Wrapper = styled.div<{ step: number }>`
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: ${p => p.step === 0 ? 'center' : 'flex-start'};
  flex-direction: column;
  padding: 0 3em;
  `;

export default Setup;