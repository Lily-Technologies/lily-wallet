import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Dropdown } from 'src/components';

import AccountAlreadyExistsBanner from './AccountAlreadyExistsBanner';
import Devices from './Devices';

import { ConfigContext, PlatformContext, AccountMapContext } from 'src/context';

import {
  createMultisigConfigFile,
  createSinglesigConfigFile,
  createSinglesigHWWConfigFile,
  saveConfig,
  createAccountId,
  clone
} from 'src/utils/files';

import { LilyConfig, OnChainConfigWithoutId, ExtendedPublicKey } from '@lily/types';

interface Props {
  newAccount: OnChainConfigWithoutId;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setupOption: number;
  currentBlockHeight: number;
  setNewAccount: React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>;
}

const ReviewScreen = ({
  setStep,
  newAccount,
  setupOption,
  currentBlockHeight,
  setNewAccount
}: Props) => {
  const { config, password, currentBitcoinNetwork, setConfigFile } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const [accountExistsId, setAccountExistsId] = useState('');
  const [localConfig, setLocalConfig] = useState<LilyConfig>(config);
  const history = useHistory();

  useEffect(() => {
    // validate account, see if account exists already
    exportSetupFiles();
  }, [newAccount]);

  const confirmSave = async () => {
    console.log('confirmSave');
    await saveConfig(localConfig, password, platform);
    setConfigFile(localConfig);
    console.log('localConfig: ', localConfig);
    const newAccountId = createAccountId(newAccount);
    console.log('newAccountId: ', newAccountId);
    setCurrentAccountId(newAccountId);
    history.push(`/vault/${newAccountId}`);
  };

  const exportSetupFiles = async () => {
    try {
      let configObject: LilyConfig;
      if (setupOption === 1) {
        configObject = createMultisigConfigFile(
          newAccount as OnChainConfigWithoutId,
          config,
          currentBlockHeight,
          currentBitcoinNetwork
        );
      } else if (setupOption === 2) {
        configObject = await createSinglesigConfigFile(
          newAccount as OnChainConfigWithoutId,
          config,
          currentBitcoinNetwork
        );
      } else if (setupOption === 3) {
        configObject = createSinglesigHWWConfigFile(
          newAccount as OnChainConfigWithoutId,
          config,
          currentBitcoinNetwork
        );
      } else {
        throw Error('Invalid setupOption');
      }

      setLocalConfig(configObject);
    } catch (e) {
      if (e instanceof Error) {
        console.log('e.message: ', e.message);
        const error = e.message;
        const accountId = error.substring(error.indexOf('#') + 1);
        console.log('accountId: ', accountId);
        setAccountExistsId(accountId);
      }
    }
  };

  const updateExtendedPublicKey = (extendedPublicKey: ExtendedPublicKey) => {
    const clonedNewAccount = clone(newAccount);
    const updatedExtendedPublicKeys = newAccount.extendedPublicKeys.map((key) => {
      if (key.id === extendedPublicKey.id) {
        return extendedPublicKey;
      }
      return key;
    });
    clonedNewAccount.extendedPublicKeys = updatedExtendedPublicKeys;

    setNewAccount(clonedNewAccount);
  };

  return (
    <div className='w-full justify-center text-gray-900 dark:text-gray-200 overflow-x-hidden px-2 pb-2'>
      <div className='flex flex-col mb-6'>
        <h3 className='text-gray-600 text-xl'>New Account</h3>
        <h1 className='text-gray-900 dark:text-gray-200 font-medium text-3xl'>
          Confirm vault details
        </h1>
      </div>

      {accountExistsId ? <AccountAlreadyExistsBanner accountId={accountExistsId} /> : null}

      <div className='bg-white dark:bg-gray-800 border-t-8 border-green-600 shadow-sm rounded-t-lg'>
        <div className='flex items-center p-4 border-b border-gray-200 dark:border-gray-600 sm:p-6 sm:grid sm:grid-cols-4 sm:gap-x-6'>
          <dl className='flex-1 grid grid-cols-2 gap-x-6 text-sm sm:col-span-2 sm:grid-cols-2 lg:col-span-2'>
            <div>
              <dt className='font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap'>
                Name
              </dt>
              <dd className='mt-1 text-gray-500 dark:text-gray-300'>{newAccount.name}</dd>
            </div>
            {/* <div className='hidden sm:block'>
              <dt className='font-medium text-gray-900 whitespace-nowrap'>Type</dt>
              <dd className='mt-1 text-gray-500'>Vault</dd>
            </div> */}
            <div>
              <dt className='font-medium text-gray-900  dark:text-gray-100 whitespace-nowrap'>
                Required signers
              </dt>
              <dd className='mt-1 text-gray-500  dark:text-gray-300'>
                {newAccount.quorum.requiredSigners} of {newAccount.quorum.totalSigners}
              </dd>
            </div>
          </dl>

          <div className='hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4'>
            <button
              onClick={() => setStep(1)}
              className='flex items-center justify-center bg-white dark:bg-gray-700 py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              Edit
            </button>
          </div>

          <Dropdown
            className='relative flex justify-end lg:hidden'
            minimal={true}
            dropdownItems={[]}
          />
        </div>

        <Devices
          extendedPublicKeys={newAccount.extendedPublicKeys}
          onSave={updateExtendedPublicKey}
        />
      </div>
      {!accountExistsId ? (
        <button
          className='w-full flex text-lg font-semibold items-center justify-center bg-green-600 py-4 px-6 rounded-b-lg shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50'
          onClick={() => confirmSave()}
        >
          Complete setup
        </button>
      ) : null}
    </div>
  );
};

export default ReviewScreen;
