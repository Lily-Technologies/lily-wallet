import React, { useContext, useState } from 'react';
import { Network } from 'bitcoinjs-lib';

import { AccountMapContext, ConfigContext } from 'src/context';

import { Tabs } from 'src/components';

import GeneralView from './GeneralView';
import DevicesView from './Devices';
import Addresses from './Addresses';
import UtxosView from './UtxosView';
import LicenseSettings from './LicenseSettings';
import ExportView from './ExportView';

import { Modal } from 'src/components';

import { NodeConfigWithBlockchainInfo } from '@lily/types';

interface Props {
  nodeConfig: NodeConfigWithBlockchainInfo;
  currentBitcoinNetwork: Network;
}

const VaultSettings = ({ nodeConfig, currentBitcoinNetwork }: Props) => {
  const [currentTab, setCurrentTab] = useState('general');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const { currentAccount } = useContext(AccountMapContext);
  const { password } = useContext(ConfigContext);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const tabItems = [
    { name: 'General', tabId: 'general' },
    { name: 'Devices', tabId: 'devices' },
    { name: 'Addresses', tabId: 'addresses' },
    { name: 'UTXOs', tabId: 'utxos' },
    ...(currentAccount.config.type === 'onchain' && currentAccount.config.quorum.totalSigners > 1
      ? [{ name: 'License', tabId: 'license' }]
      : []),
    { name: 'Export', tabId: 'export' }
  ];

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow px-8 dark:highlight-white/10'>
      <div className='pt-10 pb-4'>
        <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-300 mb-2'>Settings</h2>
        <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} items={tabItems} />
        {currentTab === 'general' && <GeneralView password={password} />}
        {currentTab === 'devices' && <DevicesView />}
        {currentTab === 'addresses' && <Addresses />}
        {currentTab === 'utxos' && <UtxosView />}
        {currentTab === 'license' && (
          <LicenseSettings
            nodeConfig={nodeConfig}
            openInModal={openInModal}
            closeModal={closeModal}
            password={password}
          />
        )}
        {currentTab === 'export' && <ExportView currentBitcoinNetwork={currentBitcoinNetwork} />}
        <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
          {modalContent}
        </Modal>
      </div>
    </div>
  );
};

export default VaultSettings;
