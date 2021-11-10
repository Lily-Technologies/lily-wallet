import React, { useState, useEffect, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { generateMnemonic } from 'bip39';
import { Network } from 'bitcoinjs-lib';

import {
  createMultisigConfigFile,
  createSinglesigConfigFile,
  createSinglesigHWWConfigFile,
  createLightningConfigFile,
  saveConfig,
  getP2wpkhDeriationPathForNetwork
} from 'src/utils/files';
import { black } from 'src/utils/colors';

import StepGroups from './Steps';
import PageHeader from './PageHeader';
import SelectAccountScreen from './SelectAccountScreen';
import InputNameScreen from './InputNameScreen';
import NewVaultScreen from './NewVaultScreen';
import SuccessScreen from './SuccessScreen';
import NewWalletScreen from './NewWalletScreen';
import NewHardwareWalletScreen from './NewHardwareWalletScreen';
import NewLightningScreen from './NewLightningScreen';

import { ConfigContext, PlatformContext } from 'src/context';

import { HwiResponseEnumerate, AddressType } from '@lily/types';

interface Props {
  password: string;
  currentBlockHeight: number;
  currentBitcoinNetwork: Network;
}

const Setup = ({ password, currentBlockHeight, currentBitcoinNetwork }: Props) => {
  document.title = `Setup - Lily Wallet`;
  const { config, setConfigFile } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const [setupOption, setSetupOption] = useState(0);
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [importedDevices, setImportedDevices] = useState<HwiResponseEnumerate[]>([]);
  const [walletMnemonic, setWalletMnemonic] = useState('');
  const [configRequiredSigners, setConfigRequiredSigners] = useState(1);
  const [addressType, setAddressType] = useState(AddressType.P2WPKH);
  const [path, setPath] = useState(getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork));
  const [lndConnectUri, setLndConnectUri] = useState('');
  const [localConfig, setLocalConfig] = useState(config);

  const exportSetupFiles = useCallback(async () => {
    let configObject;
    if (setupOption === 1) {
      configObject = await createMultisigConfigFile(
        importedDevices,
        configRequiredSigners,
        accountName,
        config,
        currentBlockHeight,
        currentBitcoinNetwork
      );
    } else if (setupOption === 2) {
      configObject = await createSinglesigConfigFile(
        walletMnemonic,
        accountName,
        config,
        currentBitcoinNetwork
      );
    } else if (setupOption === 3) {
      configObject = await createSinglesigHWWConfigFile(
        importedDevices[0],
        addressType,
        path,
        accountName,
        config,
        currentBitcoinNetwork
      );
    } else if (setupOption === 4) {
      configObject = await createLightningConfigFile(
        lndConnectUri,
        accountName,
        config,
        currentBitcoinNetwork
      );
    } else {
      throw Error('Invalid setupOption');
    }

    saveConfig(configObject, password, platform);
    setLocalConfig(configObject);
  }, [
    accountName,
    addressType,
    config,
    configRequiredSigners,
    currentBitcoinNetwork,
    currentBlockHeight,
    importedDevices,
    path,
    password,
    setupOption,
    walletMnemonic,
    lndConnectUri,
    platform
  ]);

  useEffect(() => {
    setWalletMnemonic(generateMnemonic(256));
  }, []);

  useEffect(() => {
    if (step === 3) {
      exportSetupFiles();
    }

    return () => {
      if (step === 3) {
        setConfigFile({ ...localConfig });
      }
    };
  }, [step]); // eslint-disable-line

  const Header = (
    <PageHeader
      headerText={
        step === 0
          ? 'Select account type'
          : `${
              setupOption === 2
                ? 'Create new wallet'
                : setupOption === 3
                ? 'Manage hardware wallet'
                : setupOption === 4
                ? 'Connect lightning wallet'
                : 'Create new vault'
            }`
      }
      setStep={setStep}
      step={step}
      setSetupOption={setSetupOption}
    />
  );

  let screen: JSX.Element | null = null;

  switch (step) {
    case 0:
      screen = (
        <SelectAccountScreen header={Header} setSetupOption={setSetupOption} setStep={setStep} />
      );
      break;
    case 1:
      screen = (
        <InputNameScreen
          header={Header}
          setupOption={setupOption}
          setStep={setStep}
          accountName={accountName}
          setAccountName={setAccountName}
        />
      );
      break;
    case 2:
      if (setupOption === 2) {
        screen = (
          <NewWalletScreen header={Header} walletMnemonic={walletMnemonic} setStep={setStep} />
        );
      } else if (setupOption === 3) {
        screen = (
          <NewHardwareWalletScreen
            header={Header}
            setStep={setStep}
            importedDevices={importedDevices}
            setImportedDevices={setImportedDevices}
            currentBitcoinNetwork={currentBitcoinNetwork}
            setAddressType={setAddressType}
            setPath={setPath}
          />
        );
      } else if (setupOption === 4) {
        screen = (
          <NewLightningScreen
            header={Header}
            setStep={setStep}
            lndConnectUri={lndConnectUri}
            setLndConnectUri={setLndConnectUri}
          />
        );
      } else {
        screen = (
          <NewVaultScreen
            header={Header}
            setStep={setStep}
            importedDevices={importedDevices}
            setImportedDevices={setImportedDevices}
            setConfigRequiredSigners={setConfigRequiredSigners}
            configRequiredSigners={configRequiredSigners}
            currentBitcoinNetwork={currentBitcoinNetwork}
          />
        );
      }
      break;
    case 3:
      screen = <SuccessScreen config={localConfig} />;
      break;
    default:
      screen = <div>Unexpected error</div>;
  }

  return (
    <Wrapper step={step}>
      {step > 0 && <StepGroups step={step} setupOption={setupOption} />}
      {screen}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ step: number }>`
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: ${(p) => (p.step === 0 ? 'center' : 'flex-start')};
  flex-direction: column;
  padding: 0 3em;
`;

export default Setup;
