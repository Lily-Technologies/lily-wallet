import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Link, useParams, useLocation } from "react-router-dom";
import { VerticalAlignBottom, ArrowUpward, ShowChart, AddCircleOutline, Settings } from '@styled-icons/material';
import { Safe } from '@styled-icons/crypto';
import { Transfer } from '@styled-icons/boxicons-regular/Transfer';

import { StyledIcon, Button } from '.';
import { black, blue, white, offWhite, darkGray, darkOffWhite, lightBlue, lightBlack } from '../utils/colors';

export const Sidebar = ({ caravanFile, currentDevice, setCurrentDevice }) => {
  const { name } = useParams();
  const { pathname } = useLocation();

  if (pathname !== '/coldcard-import-instructions') {
    return (
      <SidebarWrapper>
        <WalletTitle>
          <LilyImage src={require('../assets/lily.svg')} />
          Lily Wallet
          </WalletTitle>
        <WalletsHeader>Menu</WalletsHeader>
        <SidebarItem>
          <StyledIcon as={ShowChart} size={24} style={{ marginRight: 12 }} />
          Portfolio
        </SidebarItem>
        <SidebarItemLink active={pathname === '/send'} to="/send">
          <StyledIcon as={ArrowUpward} size={24} style={{ marginRight: 12 }} />
          Send
        </SidebarItemLink>
        <SidebarItemLink active={pathname === '/receive'} to="/receive">
          <StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 12 }} />
            Receive
        </SidebarItemLink>
        <SidebarItemLink active={pathname === '/transfer'} to="/transfer">
          <StyledIcon as={Transfer} size={24} style={{ marginRight: 12 }} />
            Transfer
        </SidebarItemLink>
        <SidebarItemLink active={pathname === '/settings'} to="/settings">
          <StyledIcon as={Settings} size={24} style={{ marginRight: 12 }} />
            Settings
        </SidebarItemLink>

        <WalletsHeader>Vaults</WalletsHeader>
        <SidebarItemLink
          active={pathname === '/vault'}
          to={`/vault`}>
          <StyledIcon as={Safe} size={24} style={{ marginRight: 12 }} />
          {caravanFile.name}</SidebarItemLink>

        <SidebarItemLink
          active={pathname === '/setup'}
          to={`/setup`}>
          <StyledIcon as={AddCircleOutline} size={24} style={{ marginRight: 12 }} />
          New Vault
          </SidebarItemLink>

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
  min-height: 100vh;
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
  border-bottom: 0.0625em solid ${darkGray};
  margin-bottom: .75em;
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: .25em;
`;