import React from 'react';
import styled, { css } from 'styled-components';
import { useLocation } from "react-router-dom";

import { NavLinks } from './NavLinks';

import { black, white, gray, offWhite, darkOffWhite, lightBlack } from '../utils/colors';
import { mobile } from '../utils/media';

export const Sidebar = ({ config, setCurrentAccount, loading, toggleRefresh }) => {
  const { pathname } = useLocation();

  if (pathname !== '/coldcard-import-instructions') {
    return (
      <SidebarWrapper>
        <WalletTitle>
          <LilyImage src={require('../assets/flower.svg')} />
          Lily Wallet
          </WalletTitle>
        <NavLinks config={config} setCurrentAccount={setCurrentAccount} loading={loading} toggleRefresh={toggleRefresh} />
        <FooterPositionWrapper>
          <FooterWrapper>
            <ViewSourceCodeText href="https://github.com/KayBeSee/lily-wallet" target="_blank">View Source Code</ViewSourceCodeText>
            <DontTrustVerify>Don't Trust. Verify.</DontTrustVerify>
          </FooterWrapper>
        </FooterPositionWrapper>
      </SidebarWrapper>
    );
  } else {
    return null;
  }
}

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${white};
  width: 12em;
  // min-height: 100vh;
  border: solid 1px ${darkOffWhite};
  border-left: none;
  height: 100vh;
  position: relative;

  ${mobile(css`
    flex-direction: row;
    display: none;
    height: auto;
  `)};
`;

const WalletsHeader = styled.h3`
  color: ${lightBlack};
  margin: 1.125em;
  font-size: 1.125em;
  font-weight: 100;
`;

const WalletTitle = styled(WalletsHeader)`
  display: flex;
  align-items: center;
  padding: 2.5em 1em 1.5em;
  font-weight: 700;
  margin: 0;
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: .25em;
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