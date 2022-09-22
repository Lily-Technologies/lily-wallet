import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { useHistory, useLocation } from 'react-router-dom';

import TransitionSlideLeft from './TransitionSlideLeft';

import SelectAccountScreen from './SelectAccountScreen';
import InputNameScreen from './InputNameScreen';
import NewVaultScreen from './NewVault';
import Review from './Review';
import NewWalletScreen from './NewWalletScreen';
import NewHardwareWalletScreen from './NewHardwareWalletScreen';
import NewLightningScreen from './NewLightningScreen';
import StepGroups from './Steps';

import {
  VaultConfig,
  AddressType,
  OnChainConfig,
  OnChainConfigWithoutId,
  LightningConfig
} from '@lily/types';
import { ChannelBalanceResponse, GetInfoResponse } from '@lily-technologies/lnrpc';
import { caravanToLilyConfig } from 'src/utils/files';

const EMPTY_NEW_VAULT: OnChainConfigWithoutId = {
  name: '',
  type: 'onchain',
  created_at: Date.now(),
  network: 'mainnet', // TODO: make dynamic
  addressType: AddressType.P2WPKH,
  quorum: {
    requiredSigners: 1,
    totalSigners: 0
  },
  extendedPublicKeys: []
};

interface Props {
  currentBlockHeight: number;
}

const Setup = ({ currentBlockHeight }: Props) => {
  const [setupOption, setSetupOption] = useState(0);
  const [step, setStep] = useState(0);
  const [tempLightningState, setTempLightningState] = useState<
    GetInfoResponse & ChannelBalanceResponse
  >();
  const location = useLocation();
  const history = useHistory();

  const [newAccount, setNewAccount] = useState<OnChainConfigWithoutId | LightningConfig>(
    EMPTY_NEW_VAULT
  );

  // if cancel is clicked, reset new account state
  useEffect(() => {
    if (step === 0) {
      setNewAccount(EMPTY_NEW_VAULT);
    }
  }, [step]);

  // TODO: better error handling
  useEffect(() => {
    if (location.search) {
      const queryParams = new URLSearchParams(location.search);
      const config = queryParams.get('config');
      if (config) {
        queryParams.delete('config');

        // parsed twice b/c of "overstringification"
        const parsedConfig = JSON.parse(JSON.parse(JSON.stringify(config)));
        setSetupOption(1);
        // determine if unchained or lily
        const account = parsedConfig.created_at
          ? (parsedConfig as VaultConfig)
          : caravanToLilyConfig(parsedConfig);
        setNewAccount(account);
        const status = queryParams.get('status');
        // fixes animation delay bug causing dialog to be lower on page
        setTimeout(() => {}, 1000);
        if (status === 'complete') {
          setStep(3);
        } else {
          setStep(2);
        }
        history.replace({
          search: queryParams.toString()
        });
      }
    }
  }, [location.search]);

  // TODO: better checking validation
  const importAccountFromFile = (vaultConfig: any) => {
    if (vaultConfig.quorum.totalSigners > 1) {
      const account = vaultConfig.id
        ? (vaultConfig as VaultConfig)
        : caravanToLilyConfig(vaultConfig);
      try {
        setSetupOption(1);
        setNewAccount(account);
        setStep(3);
      } catch (e) {
        if (e instanceof Error) {
          console.log('e.message: ', e.message);
        }
      }
      setStep(3);
    }
  };

  return (
    <div className='md:pl-64 flex flex-col flex-1 h-full'>
      <main className='flex flex-1 z-10 bg-gray-100 dark:bg-gray-900 relative overflow-x-hidden'>
        <div className='max-w-4xl w-full flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-8 pb-36'>
          <Transition
            show={step === 0}
            enter='transform transition-all duration-300 ease-in-out'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transform transition-all duration-0 ease-in-out'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <SelectAccountScreen
              setSetupOption={setSetupOption}
              setStep={setStep}
              importAccountFromFile={importAccountFromFile}
              setNewAccount={setNewAccount}
            />
          </Transition>

          <Transition
            show={step > 0}
            appear={true}
            className='w-full'
            enter='transform transition-all duration-500 delay-200 ease-in-out'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transform transition-all duration-100 ease-in-out'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <StepGroups step={step} setupOption={setupOption} />
          </Transition>

          <Transition
            show={step === 1}
            appear={true}
            className='w-full'
            enter='transform transition-all duration-500 delay-200 ease-in-out'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transform transition-all duration-100 ease-in-out'
            leaveFrom='translate-x-0 opacity-100'
            leaveTo='-translate-x-full opacity-0'
          >
            <InputNameScreen
              setupOption={setupOption}
              setStep={setStep}
              newAccount={newAccount}
              setNewAccountName={(accountName: string) =>
                setNewAccount({ ...newAccount, name: accountName })
              }
            />
          </Transition>

          <TransitionSlideLeft show={step === 2 && setupOption === 2} className='w-full'>
            <NewWalletScreen
              setStep={setStep}
              newAccount={newAccount as OnChainConfigWithoutId}
              setNewAccount={
                setNewAccount as React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>
              }
            />
          </TransitionSlideLeft>
          <TransitionSlideLeft show={step === 2 && setupOption === 3} className='w-full'>
            <NewHardwareWalletScreen
              setStep={setStep}
              newAccount={newAccount as OnChainConfig}
              setNewAccount={
                setNewAccount as React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>
              }
            />
          </TransitionSlideLeft>
          <TransitionSlideLeft show={step === 2 && setupOption === 4} className='w-full'>
            <NewLightningScreen
              newAccount={newAccount as LightningConfig}
              setNewAccount={setNewAccount as React.Dispatch<React.SetStateAction<LightningConfig>>}
              setStep={setStep}
              setTempLightningState={setTempLightningState}
            />
          </TransitionSlideLeft>
          <TransitionSlideLeft show={step === 2 && setupOption === 1} className='w-full'>
            <NewVaultScreen
              setStep={setStep}
              newAccount={newAccount as OnChainConfig}
              setNewAccount={
                setNewAccount as React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>
              }
            />
          </TransitionSlideLeft>
          <TransitionSlideLeft show={step === 3} className='w-full'>
            <Review
              newAccount={newAccount}
              setStep={setStep}
              setupOption={setupOption}
              currentBlockHeight={currentBlockHeight}
              setNewAccount={
                setNewAccount as React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>
              }
              tempLightningState={tempLightningState!}
            />
          </TransitionSlideLeft>
        </div>
      </main>
    </div>
  );
};

export default Setup;
