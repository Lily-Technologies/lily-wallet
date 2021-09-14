import React, { useState } from "react";
import styled from "styled-components";
import { Network } from "bitcoinjs-lib";

import GeneralView from "./GeneralView";
import AddressesView from "./AddressesView";
import UtxosView from "./UtxosView";
import LicenseSettings from "./LicenseSettings";
import ExportView from "./ExportView";
import SettingsTabs from "./SettingsTabs";

import { Modal } from "../../../components";

import { white } from "../../../utils/colors";
import { NodeConfig } from "src/types";

interface Props {
  password: string;
  nodeConfig: NodeConfig;
  currentBitcoinNetwork: Network;
}

const VaultSettings = ({
  password,
  nodeConfig,
  currentBitcoinNetwork,
}: Props) => {
  const [currentTab, setCurrentTab] = useState("general");
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
    <Wrapper>
      <HeaderContainer>
        <SettingsHeader>Settings</SettingsHeader>
        <SettingsTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </HeaderContainer>
      {currentTab === "general" && <GeneralView password={password} />}
      {currentTab === "addresses" && <AddressesView />}
      {currentTab === "utxos" && <UtxosView />}
      {currentTab === "license" && (
        <LicenseSettings
          nodeConfig={nodeConfig}
          openInModal={openInModal}
          closeModal={closeModal}
          password={password}
        />
      )}
      {currentTab === "export" && (
        <ExportView currentBitcoinNetwork={currentBitcoinNetwork} />
      )}
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </Wrapper>
  );
};

const HeaderContainer = styled.div`
  padding: 0em 1.5em;
`;

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  padding: 1.5rem;
`;

const SettingsHeader = styled.div`
  background: ${white};
  padding: 1em 0;
  font-weight: 500;
  font-size: 2em;
`;

export default VaultSettings;
