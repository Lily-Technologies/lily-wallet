import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { useLocation } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import { networks } from 'bitcoinjs-lib';

import { NavLinks } from './NavLinks';

import { black, white, gray, offWhite, darkOffWhite, lightBlack } from '../utils/colors';
import { mobile } from '../utils/media';
import { bitcoinNetworkEqual } from '../utils/transactions';

export const Sidebar = ({ config, setCurrentAccount, loading, flyInAnimation, currentBitcoinNetwork }) => {
  const { pathname } = useLocation();

  const sidebarAnimationProps = useSpring({ transform: flyInAnimation ? 'translateX(-120%)' : 'translateX(0%)' });

  if (pathname !== '/coldcard-import-instructions') {
    return (
      <Fragment>
        <SidebarPlaceholder></SidebarPlaceholder>
        <SidebarWrapperAnimated style={{ ...sidebarAnimationProps }}>
          <SidebarContainer>
            <NavLinks
              config={config}
              setCurrentAccount={setCurrentAccount}
              loading={loading}
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
          </SidebarContainer>
        </SidebarWrapperAnimated>
      </Fragment>
    );
  } else {
    return null;
  }
}

const SidebarPlaceholder = styled.div`
  width: 12em;
`;

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 12em;
  // min-height: 100vh;
  border: solid 1px ${darkOffWhite};
  border-left: none;
  height: 100vh;
  position: fixed;

  ${mobile(css`
    flex-direction: row;
    display: none;
    height: auto;
  `)};
`;

const SidebarWrapperAnimated = animated(SidebarWrapper);

const SidebarContainer = styled.div`
  position: fixed;
  height: 100%;
  width: 12em;
  background: ${white};
`;