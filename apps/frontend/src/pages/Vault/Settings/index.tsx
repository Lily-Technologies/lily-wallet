import React, { useState } from 'react';
import styled from 'styled-components';
import { Network } from 'bitcoinjs-lib';

import GeneralView from './GeneralView';
import AddressesView from './AddressesView';
import UtxosView from './UtxosView';
import LicenseSettings from './LicenseSettings';
import ExportView from './ExportView';
import SettingsTabs from './SettingsTabs';

import { Modal } from 'src/components';

import { white } from 'src/utils/colors';

import { NodeConfigWithBlockchainInfo } from '@lily/types';

interface Props {
  password: string;
  nodeConfig: NodeConfigWithBlockchainInfo;
  currentBitcoinNetwork: Network;
}

const VaultSettings = ({ password, nodeConfig, currentBitcoinNetwork }: Props) => {
  const [currentTab, setCurrentTab] = useState('general');
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
    <div className='bg-white dark:bg-gray-800 rounded shadow px-8'>
      <div className='pt-10 pb-16'>
        <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-300 mb-2'>Settings</h2>
        <SettingsTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {currentTab === 'general' && <GeneralView password={password} />}
        {currentTab === 'addresses' && <AddressesView />}
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
