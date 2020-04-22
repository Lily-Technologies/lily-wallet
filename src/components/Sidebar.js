import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Link, useParams, useLocation } from "react-router-dom";
import { VerticalAlignBottom, ArrowUpward, ShowChart, AddCircleOutline } from '@styled-icons/material';
import { Transfer } from '@styled-icons/boxicons-regular/Transfer';

import { StyledIcon, Button } from '.';
import { black, gray, white, offWhite, darkGray, darkOffWhite, lightBlue, purple } from '../utils/colors';

export const Sidebar = ({ caravanFile, currentDevice, setCurrentDevice }) => {
  const { name } = useParams();
  const { pathname } = useLocation();

  return (
    <SidebarWrapper>
      <WalletTitle>
        <CandyImage src={require('../assets/sugar.svg')} />
        Candyman
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
      <SidebarItemLink
        active={pathname === '/setup'}
        to={`/setup`}>
        <StyledIcon as={AddCircleOutline} size={24} style={{ marginRight: 12 }} />
        New Vault
        </SidebarItemLink>

      <WalletsHeader>Wallets</WalletsHeader>
      {caravanFile && caravanFile.extendedPublicKeys.map((extendedPublicKey, index) => (
        <SidebarItem
          key={index}
          active={extendedPublicKey.name === pathname.split('/')[2]}
          to={`/wallet/${extendedPublicKey.name}`}>
          {extendedPublicKey.name}
        </SidebarItem>
      ))}

      <WalletsHeader>Vaults</WalletsHeader>
      <SidebarItemLink
        active={pathname === '/vault'}
        to={`/vault`}>
        {caravanFile.name}</SidebarItemLink>
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${white};
  min-width: 225px;
`;

const SidebarItemStyle = css`
  background: ${ p => p.active ? lightBlue : white};
  color: ${darkGray};
  padding: 18px 32px;
  // margin: 12px 0;
  text-decoration: none;

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
  color: ${black};
  margin: 18px;
  font-size: 18px;
  font-weight: 100;
`;

const WalletTitle = styled(WalletsHeader)`
  display: flex;
  align-items: center;
  padding: 24px 16px;
  font-weight: 700;
  margin: 0;
  border-bottom: 2px solid ${purple};
  margin-bottom: 12px;
`;

const CandyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;