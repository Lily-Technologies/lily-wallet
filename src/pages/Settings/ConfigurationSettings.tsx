import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Network } from "bitcoinjs-lib";
import { AES } from "crypto-js";

import { Modal, Button } from "../../components";

import { PasswordModal } from "./PasswordModal";

import { LilyConfig, NodeConfig } from "../../types";

import { downloadFile, formatFilename } from "../../utils/files";
import { mobile } from "../../utils/media";
import { white, green500, gray200, gray500, gray900 } from "../../utils/colors";

interface Props {
  config: LilyConfig;
  nodeConfig: NodeConfig;
  currentBitcoinNetwork: Network;
}

const ConfigurationSettings = ({
  config,
  nodeConfig,
  currentBitcoinNetwork,
}: Props) => {
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

  const downloadCurrentConfig = (password: string) => {
    const encryptedConfigObject = AES.encrypt(
      JSON.stringify(config),
      password
    ).toString();
    downloadFile(
      encryptedConfigObject,
      formatFilename("lily_wallet_config", currentBitcoinNetwork, "txt")
    );
  };

  return (
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>Configuration Information</HeaderTitle>
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
                    downloadCurrentConfig={downloadCurrentConfig}
                  />
                )
              }
            >
              Save Backup
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Data Source</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>{nodeConfig.provider}</ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() =>
                openInModal(
                  <PasswordModal
                    downloadCurrentConfig={downloadCurrentConfig}
                  />
                )
              }
            >
              Connect to Custom Node
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>

      <Modal isOpen={modalIsOpen} onRequestClose={() => closeModal()}>
        <ModalContentWrapper>{modalContent}</ModalContentWrapper>
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

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5em;
  align-items: flex-start;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};
`;

export default ConfigurationSettings;
