import React, { useState, Fragment } from "react";
import styled, { css } from "styled-components";
import { Network } from "bitcoinjs-lib";
import { Link } from "react-router-dom";
import { RightArrowAlt } from "@styled-icons/boxicons-regular";

import {
  PageWrapper,
  PageTitle,
  Header,
  HeaderLeft,
  HeaderRight,
  Modal,
  StyledIcon,
} from "../../components";

import Tabs from "./Tabs";
import BackupSettings from "./BackupSettings";
import LicenseSettings from "./LicenseSettings";
import NetworkSettings from "./NetworkSettings";
import About from "./About";

import { white } from "../../utils/colors";
import { mobile } from "../../utils/media";

import { LilyConfig, NodeConfig } from "../../types";

interface Props {
  config: LilyConfig;
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>;
  nodeConfig: NodeConfig;
  currentBitcoinNetwork: Network;
  getNodeConfig: () => void;
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfig | undefined>>; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  password: string;
}

const Settings = ({
  config,
  setConfigFile,
  nodeConfig,
  currentBitcoinNetwork,
  getNodeConfig,
  setNodeConfig,
  password,
}: Props) => {
  const [currentTab, setCurrentTab] = useState("network");
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
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Settings</PageTitle>
          </HeaderLeft>
          {config.isEmpty && (
            <HeaderRight>
              <DecoratedLink to="/login">
                Return to Login <StyledIcon as={RightArrowAlt} />
              </DecoratedLink>
            </HeaderRight>
          )}
        </Header>
        <Wrapper>
          <Tabs
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            config={config}
          />
          {currentTab === "network" && (
            <NetworkSettings
              nodeConfig={nodeConfig}
              getNodeConfig={getNodeConfig}
              setNodeConfig={setNodeConfig}
              openInModal={openInModal}
              closeModal={closeModal}
            />
          )}
          {currentTab === "backup" && (
            <BackupSettings
              config={config}
              nodeConfig={nodeConfig}
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
          )}
          {currentTab === "license" && (
            <LicenseSettings
              config={config}
              nodeConfig={nodeConfig}
              openInModal={openInModal}
              closeModal={closeModal}
              password={password}
              setConfigFile={setConfigFile}
            />
          )}
          {currentTab === "about" && <About config={config} />}
        </Wrapper>
        <Modal isOpen={modalIsOpen} onRequestClose={() => closeModal()}>
          <ModalContentWrapper>{modalContent}</ModalContentWrapper>
        </Modal>
      </Fragment>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;

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

const DecoratedLink = styled(Link)`
  color: ${white};
  text-decoration: none;
`;

export default Settings;
