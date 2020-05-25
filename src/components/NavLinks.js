import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from "react-router-dom";
import { VerticalAlignBottom, ArrowUpward, ShowChart, AddCircleOutline, Settings } from '@styled-icons/material';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import { Transfer } from '@styled-icons/boxicons-regular/Transfer';

import { StyledIcon, Button } from '.';

import { black, blue, white, offWhite, darkGray, darkOffWhite, lightBlue, lightBlack, lightGray } from '../utils/colors';
import { mobile } from '../utils/media';


export const NavLinks = ({ config, setCurrentAccount }) => {
  const { pathname } = useLocation();

  return (
    <Fragment>
      <SidebarItem active={pathname === '/'} to="/">
        <StyledIcon as={ShowChart} size={24} style={{ marginRight: 12 }} />
          Overview
        </SidebarItem>
      <SidebarItemLink active={pathname === '/send'} to="/send">
        <StyledIcon as={ArrowUpward} size={24} style={{ marginRight: 12 }} />
          Send
        </SidebarItemLink>
      <SidebarItemLink active={pathname === '/receive'} to="/receive">
        <StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 12 }} />
            Receive
        </SidebarItemLink>
      {/* <SidebarItemLink active={pathname === '/transfer'} to="/transfer">
          <StyledIcon as={Transfer} size={24} style={{ marginRight: 12 }} />
            Transfer
        </SidebarItemLink> */}
      <SidebarItemLink active={pathname === '/settings'} to="/settings">
        <StyledIcon as={Settings} size={24} style={{ marginRight: 12 }} />
            Settings
        </SidebarItemLink>

      <WalletsHeader>Accounts</WalletsHeader>
      {
        config.wallets.map((wallet) => (
          <SidebarItemLink
            active={pathname === `/vault/${wallet.id}`}
            onClick={() => {
              console.log('wallet: ', wallet);
              setCurrentAccount(wallet);
            }}
            to={`/vault/${wallet.id}`}>
            <StyledIcon as={Wallet} size={24} style={{ marginRight: 12 }} />
            {wallet.name}</SidebarItemLink>
        ))
      }

      {
        config.vaults.map((vault) => (
          <SidebarItemLink
            active={pathname === `/vault/${vault.id}`}
            onClick={() => {
              setCurrentAccount(vault);
            }}
            to={`/vault/${vault.id}`}>
            <StyledIcon as={Safe} size={24} style={{ marginRight: 12 }} />
            {vault.name}</SidebarItemLink>
        ))
      }

      <SidebarItemLink
        active={pathname === '/setup'}
        to={`/setup`}>
        <StyledIcon as={AddCircleOutline} size={24} style={{ marginRight: 12 }} />
          New Account
          </SidebarItemLink>
    </Fragment >
  )
}

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