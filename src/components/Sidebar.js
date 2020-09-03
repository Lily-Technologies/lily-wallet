import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { useLocation } from "react-router-dom";
import { useSpring, animated } from 'react-spring';

import { NavLinks } from './NavLinks';

import { black, white, gray, offWhite, darkOffWhite, lightBlack } from '../utils/colors';
import { mobile } from '../utils/media';

export const Sidebar = ({ config, setCurrentAccount, loading, flyInAnimation }) => {
  const { pathname } = useLocation();

  const sidebarAnimationProps = useSpring({ transform: flyInAnimation ? 'translateX(-120%)' : 'translateX(0%)' });

  if (pathname !== '/coldcard-import-instructions') {
    return (
      <Fragment>
        <SidebarPlaceholder></SidebarPlaceholder>
        <SidebarWrapperAnimated style={{ ...sidebarAnimationProps }}>
          <SidebarContainer>
            <NavLinks config={config} setCurrentAccount={setCurrentAccount} loading={loading} />
            <FooterPositionWrapper>
              <FooterWrapper>
                <ViewSourceCodeText href="https://github.com/KayBeSee/lily-wallet" target="_blank">View Source Code</ViewSourceCodeText>
                <DontTrustVerify>Don't Trust. Verify.</DontTrustVerify>
              </FooterWrapper>
            </FooterPositionWrapper>
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

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${offWhite};
  padding: 1.5em;

  ${mobile(css`
    padding: 1.5em;
    font-size: 0.75em;
  `)};
`;

const FooterPositionWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const ViewSourceCodeText = styled.a`
  color: ${ black};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: -0.03em;
  font-family: 'Raleway', sans-serif;
`;

const DontTrustVerify = styled.span`
color: ${ gray};
`;