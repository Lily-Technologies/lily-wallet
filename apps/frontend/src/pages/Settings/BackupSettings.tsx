import React, { useState, useContext } from 'react';
import { Network } from 'bitcoinjs-lib';
import { AES } from 'crypto-js';

import { Modal, SettingsTable } from 'src/components';

import { PasswordModal } from './PasswordModal';

import { LilyConfig } from '@lily/types';

import { downloadFile, formatFilename } from 'src/utils/files';

import { PlatformContext } from 'src/context';
interface Props {
  config: LilyConfig;
  currentBitcoinNetwork: Network;
}

const BackupSettings = ({ config, currentBitcoinNetwork }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const downloadEncryptedCurrentConfig = (password: string) => {
    const encryptedConfigObject = AES.encrypt(JSON.stringify(config), password).toString();
    downloadFile(
      encryptedConfigObject,
      formatFilename('lily_wallet_config', currentBitcoinNetwork, 'txt'),
      platform
    );
  };

  const downloadUnencryptedCurrentConfig = () => {
    downloadFile(
      JSON.stringify(config),
      formatFilename('lily_wallet_config', currentBitcoinNetwork, 'json'),
      platform
    );
  };

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Backup</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          This information is private and only seen by you.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>

      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Configuration File</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              onClick={() =>
                openInModal(
                  <PasswordModal
                    downloadEncryptedCurrentConfig={downloadEncryptedCurrentConfig}
                    downloadUnencryptedCurrentConfig={downloadUnencryptedCurrentConfig}
                  />
                )
              }
            >
              Save Backup
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </SettingsTable.Wrapper>
  );
};

export default BackupSettings;
