import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Network } from 'bitcoinjs-lib';
import { Link } from 'react-router-dom';
import { RightArrowAlt } from '@styled-icons/boxicons-regular';

import {
  PageWrapper,
  PageTitle,
  Header,
  HeaderLeft,
  HeaderRight,
  StyledIcon,
  Modal
} from 'src/components';

import Tabs from './Tabs';
import BackupSettings from './BackupSettings';
import NetworkSettings from './NetworkSettings';
import About from './About';

import { white } from 'src/utils/colors';

import { NodeConfigWithBlockchainInfo } from '@lily/types';

import { ConfigContext } from 'src/context/ConfigContext';

interface Props {
  nodeConfig: NodeConfigWithBlockchainInfo;
  currentBitcoinNetwork: Network;
  getNodeConfig: () => void;
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfigWithBlockchainInfo | undefined>>; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  password: string;
}

const Settings = ({
  nodeConfig,
  currentBitcoinNetwork,
  getNodeConfig,
  setNodeConfig,
  password
}: Props) => {
  const { config } = useContext(ConfigContext);
  const [currentTab, setCurrentTab] = useState('network');
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
              <DecoratedLink to='/login'>
                Return to Login <StyledIcon as={RightArrowAlt} />
              </DecoratedLink>
            </HeaderRight>
          )}
        </Header>
        <Wrapper className='bg-white dark:bg-gray-800'>
          <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} config={config} />
          {currentTab === 'network' && (
            <NetworkSettings
              nodeConfig={nodeConfig}
              getNodeConfig={getNodeConfig}
              setNodeConfig={setNodeConfig}
              openInModal={openInModal}
              closeModal={closeModal}
            />
          )}
          {currentTab === 'backup' && (
            <BackupSettings config={config} currentBitcoinNetwork={currentBitcoinNetwork} />
          )}
          {currentTab === 'about' && <About />}
        </Wrapper>
        <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
          {modalContent}
        </Modal>
      </>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
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
