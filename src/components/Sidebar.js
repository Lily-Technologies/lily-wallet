import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from "react-router-dom";

import { NavLinks } from './NavLinks';

import { black, blue, white, offWhite, darkGray, darkOffWhite, lightBlue, lightBlack, lightGray } from '../utils/colors';
import { mobile } from '../utils/media';

export const Sidebar = ({ config, setCurrentAccount, loading }) => {
  const { pathname } = useLocation();

  if (pathname !== '/coldcard-import-instructions') {
    return (
      <SidebarWrapper>
        <WalletTitle>
          <LilyImage src={require('../assets/lily.svg')} />
          Lily Wallet
          </WalletTitle>
        <NavLinks config={config} setCurrentAccount={setCurrentAccount} />
        {loading && 'loading...'}

        {/* <WalletsHeader>Devices</WalletsHeader>
        {caravanFile && caravanFile.extendedPublicKeys.map((extendedPublicKey, index) => (
          <SidebarItem
            key={index}
            active={extendedPublicKey.name === pathname.split('/')[2]}
            to={`/wallet/${extendedPublicKey.name}`}>
            {extendedPublicKey.name}
          </SidebarItem>
        ))} */}
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

  ${mobile(css`
    flex-direction: row;
    display: none;
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
  padding: 1.5em 1em;
  font-weight: 700;
  margin: 0;
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: .25em;
`;