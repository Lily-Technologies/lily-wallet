import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Network } from 'bitcoinjs-lib';
import { QRCode } from 'react-qr-svg';

import { requireOnchain } from 'src/hocs';

import { MnemonicWordsDisplayer, Modal, SettingsTable } from 'src/components';
import { white, black, gray100 } from 'src/utils/colors';

import { CaravanConfig, LilyOnchainAccount, OnChainConfig } from '@lily/types';

import {
  createColdCardBlob,
  downloadFile,
  formatFilename,
  lilyConfigToCaravan
} from 'src/utils/files';
import { PlatformContext } from 'src/context';

interface Props {
  currentAccount: LilyOnchainAccount;
  currentBitcoinNetwork: Network;
}

const ExportView = ({ currentAccount, currentBitcoinNetwork }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const downloadColdcardMultisigFile = () => {
    if (currentAccount.config.extendedPublicKeys) {
      const ccFile = createColdCardBlob(
        currentAccount.config.quorum.requiredSigners,
        currentAccount.config.quorum.totalSigners,
        currentAccount.config.name,
        currentAccount.config.extendedPublicKeys,
        currentAccount.config.addressType,
        currentBitcoinNetwork
      );
      downloadFile(
        ccFile,
        formatFilename(
          `${currentAccount.config.name}-lily-coldcard-file`,
          currentBitcoinNetwork,
          'txt'
        ),
        platform
      );
    }
  };

  const downloadLilyFile = (config: OnChainConfig) => {
    const configCopy = { ...config };
    const lilyFile = JSON.stringify(configCopy);
    downloadFile(
      lilyFile,
      formatFilename(`${config.name}-lily`, currentBitcoinNetwork, 'json'),
      platform
    );
  };

  const downloadCaravanFile = (config: OnChainConfig) => {
    const caravanFile: CaravanConfig = lilyConfigToCaravan(config);
    downloadFile(
      JSON.stringify(caravanFile),
      formatFilename('lily-caravan-file', currentBitcoinNetwork, 'json'),
      platform
    );
  };

  const XpubQrCode = () => (
    <div className='flex flex-col w-full'>
      <h2 className='border-b border-gray-400 dark:border-slate-100/10 px-5 py-6 flex items-center justify-between text-3xl text-slate-900 dark:text-slate-200'>
        Scan this with your device
      </h2>
      <div className='flex justify-center p-4 bg-gray-100 dark:bg-slate-800'>
        <QRCode
          bgColor={white}
          fgColor={black}
          level='Q'
          style={{ width: 256 }}
          value={currentAccount.config.extendedPublicKeys[0].xpub as string}
        />
      </div>
    </div>
  );

  const MnemonicQrCode = () => (
    <div className='flex flex-col w-full'>
      <h2 className='border-b border-gray-400 dark:border-slate-100/10 px-5 py-6 flex items-center justify-between text-3xl text-slate-900 dark:text-slate-200'>
        Scan this with your device
      </h2>
      <div className='flex justify-center p-4 bg-gray-100 dark:bg-slate-800'>
        <QRCode
          bgColor={white}
          fgColor={black}
          level='Q'
          style={{ width: 256 }}
          value={currentAccount.config.mnemonic as string}
        />
      </div>
    </div>
  );

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Export Account</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          Use the options below to use other software to verify the information and data.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      {currentAccount.config.mnemonic && (
        <SettingsTable.Row>
          <SettingsTable.KeyColumn>Recovery Words</SettingsTable.KeyColumn>
          <SettingsTable.ValueColumn>
            <SettingsTable.ValueText></SettingsTable.ValueText>
            <SettingsTable.ValueAction style={{ display: 'flex' }}>
              <button
                className='ml-4 bg-white dark:bg-gray-800 rounded-md font-medium text-green-500 hover:text-green-400 focus:outline-none focus:ring-2  focus:ring-green-300'
                onClick={() => {
                  openInModal(<MnemonicQrCode />);
                }}
              >
                View QR Code
              </button>
              <span className='text-gray-300 ml-4 dark:text-slate-600' aria-hidden='true'>
                |
              </span>
              <button
                className='ml-4 bg-white dark:bg-gray-800 rounded-md font-medium text-green-500 hover:text-green-400 focus:outline-none focus:ring-2  focus:ring-green-300'
                onClick={() =>
                  openInModal(
                    <div className='flex flex-col w-full'>
                      <h2 className='border-b border-gray-400 dark:border-slate-100/10 px-5 py-6 flex items-center justify-between text-3xl text-slate-900 dark:text-slate-200'>
                        Do not share these words with anyone.
                      </h2>
                      <div className='flex justify-center p-4 bg-gray-100 dark:bg-slate-800'>
                        <MnemonicWordsDisplayer mnemonicWords={currentAccount.config.mnemonic!} />
                      </div>
                    </div>
                  )
                }
              >
                View Words
              </button>
            </SettingsTable.ValueAction>
          </SettingsTable.ValueColumn>
        </SettingsTable.Row>
      )}
      {currentAccount.config.quorum.totalSigners > 1 && (
        <>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>Lily Backup</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <button
                  className='ml-4 bg-white dark:bg-gray-800 rounded-md font-medium text-green-500 hover:text-green-400 focus:outline-none focus:ring-2  focus:ring-green-300'
                  onClick={() => {
                    downloadLilyFile(currentAccount.config);
                  }}
                >
                  Download
                </button>
              </SettingsTable.ValueAction>
            </SettingsTable.ValueColumn>
          </SettingsTable.Row>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>Coldcard Multisig File</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <button
                  className='ml-4 bg-white dark:bg-gray-800 rounded-md font-medium text-green-500 hover:text-green-400 focus:outline-none focus:ring-2  focus:ring-green-300'
                  onClick={() => {
                    downloadColdcardMultisigFile();
                  }}
                >
                  Download
                </button>
              </SettingsTable.ValueAction>
            </SettingsTable.ValueColumn>
          </SettingsTable.Row>
          <SettingsTable.Row>
            <SettingsTable.KeyColumn>Caravan File</SettingsTable.KeyColumn>
            <SettingsTable.ValueColumn>
              <SettingsTable.ValueText></SettingsTable.ValueText>
              <SettingsTable.ValueAction>
                <button
                  className='ml-4 bg-white dark:bg-gray-800 rounded-md font-medium text-green-500 hover:text-green-400 focus:outline-none focus:ring-2  focus:ring-green-300'
                  onClick={() => {
                    downloadCaravanFile(currentAccount.config);
                  }}
                >
                  Download
                </button>
              </SettingsTable.ValueAction>
            </SettingsTable.ValueColumn>
          </SettingsTable.Row>
        </>
      )}
      {currentAccount.config.quorum.totalSigners === 1 && (
        <SettingsTable.Row>
          <SettingsTable.KeyColumn>Extended Public Key (XPub)</SettingsTable.KeyColumn>
          <SettingsTable.ValueColumn>
            <SettingsTable.ValueText></SettingsTable.ValueText>
            <SettingsTable.ValueAction>
              <button
                className='ml-4 bg-white dark:bg-gray-800 rounded-md font-medium text-green-500 hover:text-green-400 focus:outline-none focus:ring-2  focus:ring-green-300'
                onClick={() => {
                  openInModal(<XpubQrCode />);
                }}
              >
                View QR Code
              </button>
            </SettingsTable.ValueAction>
          </SettingsTable.ValueColumn>
        </SettingsTable.Row>
      )}
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </SettingsTable.Wrapper>
  );
};

export default requireOnchain(ExportView);
