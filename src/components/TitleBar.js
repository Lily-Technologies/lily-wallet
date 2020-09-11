import React, { useState, Fragment } from 'react'
import styled, { css } from 'styled-components';
import { mobile } from '../utils/media';
import { Circle } from '@styled-icons/boxicons-solid';
import { Menu } from '@styled-icons/boxicons-regular';
import BigNumber from 'bignumber.js';

import { offWhite, blue500, blue600, blue700, blue800, white, gray400, gray700, green400, orange400, red500 } from '../utils/colors';

import { ConnectToNodeModal, Button, StyledIcon, Dropdown } from '.';

export const TitleBar = ({ setNodeConfig, nodeConfig, setMobileNavOpen, config, connectToBlockstream, connectToBitcoinCore, getNodeConfig }) => {
  console.log('nodeConfig: ', nodeConfig)
  const [nodeConfigModalOpen, setNodeConfigModalOpen] = useState(false);
  const [moreOptionsDropdownOpen, setMoreOptionsDropdownOpen] = useState(false);
  const [nodeOptionsDropdownOpen, setNodeOptionsDropdownOpen] = useState(false);

  const refreshNodeData = async () => {
    await getNodeConfig();
  }

  const dropdownItems = [];

  dropdownItems.push({
    label: (
      <Fragment>
        Status: <br />
        {nodeConfig && nodeConfig.initialblockdownload ? `Initializing (${BigNumber(nodeConfig.verificationprogress).multipliedBy(100).toFixed(2)}%)`
          : nodeConfig && nodeConfig.connected ? 'Connected'
            : nodeConfig && !nodeConfig.connected ? 'Disconnected'
              : 'Connecting...'}
      </Fragment>
    )
  });

  dropdownItems.push({})

  if (nodeConfig && nodeConfig.blocks) {
    dropdownItems.push({ label: `Block Height: ${nodeConfig ? nodeConfig.blocks.toLocaleString() : 'Connecting...'}` });
  }

  dropdownItems.push({ label: 'Refresh Node Info', onClick: () => { refreshNodeData() } });
  dropdownItems.push({})

  if (nodeConfig && nodeConfig.provider !== 'Bitcoin Core') {
    dropdownItems.push({ label: 'Connect to Bitcoin Core', onClick: async () => await connectToBitcoinCore() })
  } else {
    dropdownItems.push({ label: 'Connect to Blockstream', onClick: async () => await connectToBlockstream() })
  }
  dropdownItems.push({ label: 'Connect to Custom Node', onClick: () => setNodeConfigModalOpen(true) })

  return (
    <DraggableTitleBar>
      <ConnectToNodeModal
        isOpen={nodeConfigModalOpen}
        onRequestClose={() => setNodeConfigModalOpen(false)}
        setNodeConfig={setNodeConfig}
      />
      <LeftSection>
        {!config.isEmpty && (
          <MobileMenuOpen onClick={() => setMobileNavOpen(true)} >
            <StyledIcon as={Menu} size={36} /> Menu
          </MobileMenuOpen>
        )}
      </LeftSection>
      <RightSection>
        <NodeButtonContainer>
          <Dropdown
            isOpen={nodeOptionsDropdownOpen}
            setIsOpen={setNodeOptionsDropdownOpen}
            style={{ background: blue800, color: white, padding: '0.35em 1em', border: 'none', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center' }}
            buttonLabel={
              <Fragment>
                {nodeConfig ? (
                  <StyledIcon as={Circle} style={{
                    color: (nodeConfig.initialblockdownload) ? orange400
                      : (nodeConfig.connected) ? green400
                        : red500, // !nodeConfig.connected
                    marginRight: '.5em'
                  }} />
                ) : (
                    <LoadingImage alt="loading placeholder" src={require('../assets/flower-loading.svg')} />
                  )}
                {nodeConfig && nodeConfig.connected ? `Connected: ${nodeConfig.provider}`
                  : nodeConfig && !nodeConfig.connected ? `Disconnected: ${nodeConfig.provider}`
                    : 'Connecting...'}
              </Fragment>
            }
            dropdownItems={dropdownItems}
          >
          </Dropdown>
        </NodeButtonContainer>

        <DotDotDotContainer>
          <Dropdown
            style={{ color: white }}
            isOpen={moreOptionsDropdownOpen}
            setIsOpen={setMoreOptionsDropdownOpen}
            minimal={true}
            dropdownItems={[
              { label: 'Support', onClick: () => { console.log('foobar') } },
              { label: 'License', onClick: () => { console.log('foobar2') } },
              { label: 'View source code', onClick: () => { console.log('foobar2') } },
              { label: 'Sign out', onClick: () => { console.log('foobar3') } }
            ]}
          />
        </DotDotDotContainer>
      </RightSection>
    </DraggableTitleBar >
  )

}

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-right: .25em;
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

const NodeConfigDropdown = styled(Dropdown)`
`;

const MobileMenuOpen = styled.div`
  display: none;
  color: ${white};
  cursor: pointer;
  margin-left: 3.5em;
  align-items: center;
  ${mobile(css`
    display: flex;
  `)}

`;

const DotDotDotContainer = styled.div`
  margin: 0 1em 0 0;
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
`;

const DraggableTitleBar = styled.div`
  position: fixed;
  background: ${blue600};
  -webkit-user-select: none;
  -webkit-app-region: drag;
  height: 2.5rem;
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Montserrat, sans-serif;
`;

const NodeButtonContainer = styled.div`
  margin: 0 1em;
  -webkit-app-region: no-drag;
`;

const NodeButton = styled.button`
  ${Button};
  align-self: flex-end;
  cursor: pointer;
  font-size: 0.85em;
  padding: 0.15em 1em;
`;