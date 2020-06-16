import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from "react-router-dom";

import { NavLinks } from './NavLinks';

import { black, blue, white, gray, offWhite, darkGray, darkOffWhite, lightBlue, lightBlack, lightGray } from '../utils/colors';
import { mobile } from '../utils/media';

export const Sidebar = ({ config, setCurrentAccount, loading }) => {
  const { pathname } = useLocation();

  if (pathname !== '/coldcard-import-instructions') {
    return (
      <SidebarWrapper>
        <WalletTitle>
          <LilyImage src={require('../assets/flower.svg')} />
          Lily Wallet
          </WalletTitle>
        <NavLinks config={config} setCurrentAccount={setCurrentAccount} loading={loading} />
        {/* <WalletsHeader>Devices</WalletsHeader>
        {caravanFile && caravanFile.extendedPublicKeys.map((extendedPublicKey, index) => (
          <SidebarItem
            key={index}
            active={extendedPublicKey.name === pathname.split('/')[2]}
            to={`/wallet/${extendedPublicKey.name}`}>
            {extendedPublicKey.name}
          </SidebarItem>
        ))} */}
        <FooterPositionWrapper>
          <FooterWrapper>
            <ViewSourceCodeText href="https://github.com/KayBeSee/cc-kitchen-frontend" target="_blank">View Source Code</ViewSourceCodeText>
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

const SidebarItemStyle = css`
  background: ${ p => p.active ? lightBlue : white};
  border: ${ p => p.active ? `solid 0.0625em ${darkOffWhite}` : 'none'};
  border-left: ${ p => p.active ? `solid 0.6875em ${blue}` : 'none'};
  margin-left: ${ p => p.active ? `solid 0.6875em ${blue}` : 'none'};
  border-right: none;
  color: ${ p => p.active ? 'inherit' : darkGray};
  padding: ${ p => p.active ? `1em 1.2em 1.125em .5em` : '1em 1.2em'};
  text-decoration: none;
  font-size: 0.9em;
  display: flex;

  ${mobile(css`
    border-left: none;
    border-top: ${ p => p.active ? `solid 0.6875em ${blue}` : 'none'};
    margin-top: ${ p => p.active ? `solid 0.6875em ${blue}` : 'none'};
    align-items: center;
  `)};

  &:hover {
    background: ${offWhite};
    cursor: pointer;
  }
`;

const SidebarItem = styled(Link)`
  ${SidebarItemStyle};
`;

const SidebarItemLink = styled(Link)`
  ${SidebarItemStyle};
  text-decoration: none;
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