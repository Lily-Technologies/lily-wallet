import React, { useState, Fragment } from 'react'
import styled, { css } from 'styled-components';
import { mobile } from '../utils/media';
import { Circle } from '@styled-icons/boxicons-solid';
import { Menu } from '@styled-icons/boxicons-regular';

import { offWhite, blue600, blue700, blue800, white, gray400, gray700, green400 } from '../utils/colors';

import { ConnectToNodeModal, Button, StyledIcon, Dropdown } from '.';

export const TitleBar = ({ setNodeConfig, nodeConfig, setMobileNavOpen, config }) => {
  const [nodeConfigModalOpen, setNodeConfigModalOpen] = useState(false);
  const [moreOptionsDropdownOpen, setMoreOptionsDropdownOpen] = useState(false);
  const [nodeOptionsDropdownOpen, setNodeOptionsDropdownOpen] = useState(false);

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
                <StyledIcon as={Circle} style={{ color: green400, marginRight: '.5em' }} />
                {nodeConfig ? "Connected to Node" : "Connected to Blockstream"}
              </Fragment>
            }
            dropdownItems={[
              { label: 'Block Height: 164,002', onClick: () => { console.log('foobar2') } },
              { label: 'Connect to Node', onClick: () => setNodeConfigModalOpen(true) },
            ]}
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
  background: ${blue700};
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