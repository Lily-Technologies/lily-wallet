import React, { useState, useRef } from 'react';
import { Bank } from '@styled-icons/remix-line';
import { Calculator } from '@styled-icons/heroicons-outline';
import { Bolt } from '@styled-icons/open-iconic';
import { v4 as uuidv4 } from 'uuid';

import { Dropdown, FileUploader, ErrorModal, Modal } from 'src/components';

import { green700 } from 'src/utils/colors';

import {
  File,
  VaultConfig,
  AddressType,
  OnChainConfigWithoutId,
  LightningConfig
} from '@lily/types';

const EMPTY_NEW_VAULT: OnChainConfigWithoutId = {
  name: '',
  type: 'onchain',
  created_at: Date.now(),
  network: 'mainnet', // TODO: make dynamic
  addressType: AddressType.P2WSH,
  quorum: {
    requiredSigners: 1,
    totalSigners: 0
  },
  extendedPublicKeys: []
};

const EMPTY_NEW_LIGHTNING: LightningConfig = {
  id: uuidv4(),
  type: 'lightning',
  created_at: Date.now(),
  network: 'mainnet', // TODO: make dynamic
  name: '',
  connectionDetails: {
    lndConnectUri: ''
  }
};

interface Props {
  setSetupOption: React.Dispatch<React.SetStateAction<number>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  importAccountFromFile: (configFile: VaultConfig) => void;
  setNewAccount: React.Dispatch<React.SetStateAction<OnChainConfigWithoutId | LightningConfig>>;
}

const SelectAccountScreen = ({
  setSetupOption,
  setStep,
  importAccountFromFile,
  setNewAccount
}: Props) => {
  const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  return (
    <div className='w-full justify-center text-gray-900 dark:text-gray-200 overflow-x-hidden relative my-20 sm:my-52'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex flex-col'>
          <h3 className='text-gray-600 text-xl'>New Account</h3>
          <h1 className='text-gray-900 dark:text-gray-200 font-medium text-3xl'>
            Select account type
          </h1>
        </div>
        <Dropdown
          data-cy='Select account dropdown'
          minimal={true}
          className='text-black dark:text-white'
          dropdownItems={[
            {
              label: 'New mnemonic wallet',
              onClick: () => {
                setSetupOption(2);
                setStep(1);
              }
            },
            {
              label: 'Import from file',
              onClick: () => {
                const importDeviceFromFile = importDeviceFromFileRef.current;
                if (importDeviceFromFile) {
                  importDeviceFromFile.click();
                }
              }
            }
          ]}
        />
      </div>
      <div className='flex flex-col space-y-4'>
        <button
          className='flex items-center py-6 rounded-2xl  shadow px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-white/10 dark:highlight-white/10 border-t-4'
          style={{ borderTopColor: green700 }}
          onClick={() => {
            setNewAccount(EMPTY_NEW_VAULT);
            setSetupOption(3);
            setStep(1);
          }}
        >
          <div className='flex shrink-0 items-center h-10 w-10'>
            <Calculator />
          </div>
          <div className='flex flex-col text-left ml-6'>
            <h3 className='text-xl leading-6 font-medium text-gray-900 dark:text-gray-200'>
              Hardware Wallet
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Import your hardware wallet to send, receive, and manage your bitcoin
            </p>
          </div>
        </button>

        <button
          className='flex items-center py-6 rounded-2xl  shadow px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-white/10 dark:highlight-white/10'
          onClick={() => {
            setNewAccount(EMPTY_NEW_VAULT);
            setSetupOption(1);
            setStep(1);
          }}
        >
          <div className='flex shrink-0 items-center h-10 w-10'>
            <Bank />
          </div>
          <div className='flex flex-col text-left ml-6'>
            <h3 className='text-xl leading-6 font-medium text-gray-900 dark:text-gray-200'>
              Multisignature Vault
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Combine multiple hardware wallets to create a vault for securing larger amounts of
              bitcoin
            </p>
          </div>
        </button>

        <button
          className='flex items-center py-6 rounded-2xl  shadow px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-white/10 dark:highlight-white/10'
          onClick={() => {
            setNewAccount(EMPTY_NEW_LIGHTNING);
            setSetupOption(4);
            setStep(1);
          }}
        >
          <div className='flex shrink-0 items-center h-10 w-10'>
            <Bolt />
          </div>
          <div className='flex flex-col text-left ml-6'>
            <h3 className='text-xl leading-6 font-medium text-gray-900 dark:text-gray-200'>
              Lightning Wallet
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Connect to your lightning wallet to manage channels and send payments
            </p>
          </div>
        </button>
      </div>
      <FileUploader
        accept='application/JSON'
        id='importDeviceFromFile'
        onFileLoad={({ file }: File) => {
          try {
            const parsedFile: VaultConfig = JSON.parse(file);
            importAccountFromFile(parsedFile);
          } catch (e) {
            openInModal(<ErrorModal message='Invalid file' closeModal={closeModal} />);
          }
        }}
      />
      <label
        className='hidden'
        htmlFor='importDeviceFromFile'
        ref={importDeviceFromFileRef}
      ></label>

      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default SelectAccountScreen;
