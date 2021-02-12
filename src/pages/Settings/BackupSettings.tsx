import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Network } from "bitcoinjs-lib";
import { AES } from "crypto-js";

import { Button, Modal } from "../../components";

import { PasswordModal } from "./PasswordModal";

import { LilyConfig } from "../../types";

import { downloadFile, formatFilename } from "../../utils/files";
import { mobile } from "../../utils/media";
import { white, green500, gray200, gray500, gray900 } from "../../utils/colors";
interface Props {
  config: LilyConfig;
  currentBitcoinNetwork: Network;
}

const BackupSettings = ({ config, currentBitcoinNetwork }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const downloadEncryptedCurrentConfig = (password: string) => {
    const encryptedConfigObject = AES.encrypt(
      JSON.stringify(config),
      password
    ).toString();
    downloadFile(
      encryptedConfigObject,
      formatFilename("lily_wallet_config", currentBitcoinNetwork, "txt")
    );
  };

  const downloadUnencryptedCurrentConfig = () => {
    downloadFile(
      JSON.stringify(config),
      formatFilename("lily_wallet_config", currentBitcoinNetwork, "json")
    );
  };

  return (
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>Backup</HeaderTitle>
        <HeaderSubtitle>
          This information is private and only seen by you.
        </HeaderSubtitle>
      </HeaderSection>

      <ProfileRow>
        <ProfileKeyColumn>Configuration File</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() =>
                openInModal(
                  <PasswordModal
                    downloadEncryptedCurrentConfig={
                      downloadEncryptedCurrentConfig
                    }
                    downloadUnencryptedCurrentConfig={
                      downloadUnencryptedCurrentConfig
                    }
                  />
                )
              }
            >
              Save Backup
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </GeneralSection>
  );
};

const HeaderSection = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1em;
`;

const HeaderTitle = styled.h3`
  color: ${gray900};
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.5em;
`;

const HeaderSubtitle = styled.span`
  color: ${gray500};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  max-width: 42rem;
`;

const GeneralSection = styled.div`
  padding: 0.5em 1.5em;
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-top: 1px solid ${gray200};

  ${mobile(css`
    display: block;
  `)}
`;

const ProfileKeyColumn = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 600;
  align-items: center;
  display: flex;
`;

const ProfileValueColumn = styled.div`
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
`;

const ProfileValueText = styled.span`
  flex: 1;
`;

const ProfileValueAction = styled.span`
  margin-left: 1rem;
`;

const ActionButton = styled.button`
  ${Button};
  font-weight: 600;
`;

export default BackupSettings;
