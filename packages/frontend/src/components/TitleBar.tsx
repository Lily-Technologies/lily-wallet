import React, { useState, Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Circle } from '@styled-icons/boxicons-solid';
import FlowerLoading from 'src/assets/flower-loading.svg';

import { white, green400, orange400, red500, green800, green900 } from 'src/utils/colors';

import { AccountMapContext, PlatformContext } from 'src/context';

import { getNodeStatus } from 'src/utils/other';

import { StyledIcon, Dropdown, Modal, SupportModal, DropdownItemProps } from '.';

import { NodeConfigWithBlockchainInfo, LilyConfig } from '@lily/types';

interface Props {
  nodeConfig: NodeConfigWithBlockchainInfo | undefined; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  config: LilyConfig;
}

export const TitleBar = ({ nodeConfig, config }: Props) => {
  const history = useHistory();
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const { platform } = useContext(PlatformContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const nodeConfigDropdownItems: DropdownItemProps[] = [];

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  nodeConfigDropdownItems.push({
    label: (
      <Fragment>
        Network Status: <br />
        {getNodeStatus(nodeConfig)}
      </Fragment>
    )
  });

  nodeConfigDropdownItems.push({});
  nodeConfigDropdownItems.push({
    label: 'Network Settings',
    onClick: () => history.push('/settings', { currentTab: 'network' })
  });

  const moreOptionsDropdownItems = [
    {
      label: 'Support',
      onClick: () => {
        openInModal(<SupportModal closeModal={closeModal} />);
        // window.open("https://lily-wallet.com/support", "_blank");
      }
    },
    {
      label: 'View source code',
      onClick: () => {
        window.open('https://github.com/KayBeSee/lily-wallet', '_blank');
      }
    }
  ] as { label?: string; onClick?: () => void; onlyMobile?: boolean }[];

  if (!config.isEmpty) {
    moreOptionsDropdownItems.unshift(
      {
        label: 'Home',
        onClick: () => history.push('/'),
        onlyMobile: true
      },
      {
        label: 'Send',
        onClick: () => history.push('/send'),
        onlyMobile: true
      },
      {
        label: 'Receive',
        onClick: () => history.push('/receive'),
        onlyMobile: true
      },
      {
        label: 'Settings',
        onClick: () => history.push('/settings'),
        onlyMobile: true
      },
      { onlyMobile: true },
      ...config.wallets.map((wallet) => ({
        label: wallet.name,
        onClick: () => {
          history.push(`/vault/${wallet.id}`);
          setCurrentAccountId(wallet.id);
        },
        onlyMobile: true
      })),
      ...config.vaults.map((vault) => ({
        label: vault.name,
        onClick: () => {
          history.push(`/vault/${vault.id}`);
          setCurrentAccountId(vault.id);
        },
        onlyMobile: true
      })),
      { onlyMobile: true },
      {
        label: 'New Account',
        onClick: () => history.push('/setup'),
        onlyMobile: true
      },
      { onlyMobile: true }
    );
  }

  moreOptionsDropdownItems.push(
    {},
    {
      label: 'Quit Lily Wallet',
      onClick: async () => {
        platform.quit();
      }
    }
  );

  return (
    <Fragment>
      <HeightHolder />
      <DraggableTitleBar className='bg-green-800'>
        <LeftSection></LeftSection>
        <RightSection>
          <NodeButtonContainer>
            <Dropdown
              minimal={false}
              style={{
                background: '#064e3b',
                color: white,
                padding: '0.35em 1em',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                display: 'flex',
                alignItems: 'center'
              }}
              buttonLabel={
                <Fragment>
                  {nodeConfig ? (
                    <StyledIcon
                      as={Circle}
                      style={{
                        color: nodeConfig.initialblockdownload
                          ? orange400
                          : nodeConfig.connected
                          ? green400
                          : red500 // !nodeConfig.connected
                      }}
                    />
                  ) : (
                    <LoadingImage alt='loading placeholder' src={FlowerLoading} />
                  )}
                  {nodeConfig && nodeConfig.connected
                    ? null
                    : nodeConfig && !nodeConfig.connected
                    ? null
                    : 'Connecting...'}
                </Fragment>
              }
              dropdownItems={nodeConfigDropdownItems}
            />
          </NodeButtonContainer>

          <DotDotDotContainer>
            <Dropdown
              style={{ color: white }}
              minimal={true}
              dropdownItems={moreOptionsDropdownItems}
            />
          </DotDotDotContainer>
        </RightSection>
      </DraggableTitleBar>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </Fragment>
  );
};

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-right: 0.25em;
  opacity: 0.9;
`;

const LeftSection = styled.div`
  display: flex;
  margin-left: 1em;
`;
const RightSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const DotDotDotContainer = styled.div`
  margin: 0 1em 0 0;
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
`;

const DraggableTitleBar = styled.div`
  top: 0;
  position: fixed;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  height: 2.5rem;
  width: 100%;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Montserrat, sans-serif;
`;

const HeightHolder = styled.div`
  height: 2.5rem;
  z-index: 0;
  background: transparent;
`;

const NodeButtonContainer = styled.div`
  margin: 0 0.25em;
  -webkit-app-region: no-drag;
`;
