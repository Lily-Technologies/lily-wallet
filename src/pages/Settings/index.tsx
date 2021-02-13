import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Network } from "bitcoinjs-lib";
import { Link } from "react-router-dom";
import { RightArrowAlt } from "@styled-icons/boxicons-regular";

import {
  PageWrapper,
  PageTitle,
  Header,
  HeaderLeft,
  HeaderRight,
  StyledIcon,
  Modal,
} from "../../components";

import Tabs from "./Tabs";
import BackupSettings from "./BackupSettings";
import LicenseSettings from "./LicenseSettings";
import NetworkSettings from "./NetworkSettings";
import About from "./About";

import { white } from "../../utils/colors";

import { NodeConfig } from "../../types";

import { ConfigContext } from "../../ConfigContext";

interface Props {
  nodeConfig: NodeConfig;
  currentBitcoinNetwork: Network;
  getNodeConfig: () => void;
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfig | undefined>>; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  password: string;
}

const Settings = ({
  nodeConfig,
  currentBitcoinNetwork,
  getNodeConfig,
  setNodeConfig,
  password,
}: Props) => {
  const { config } = useContext(ConfigContext);
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
      <>
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
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
          )}
          {currentTab === "license" && (
            <LicenseSettings
              nodeConfig={nodeConfig}
              openInModal={openInModal}
              closeModal={closeModal}
              password={password}
            />
          )}
          {currentTab === "about" && <About />}
        </Wrapper>
        <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
          {modalContent}
        </Modal>
      </>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

const DecoratedLink = styled(Link)`
  color: ${white};
  text-decoration: none;
  font-weight: 500;
`;

export default Settings;
