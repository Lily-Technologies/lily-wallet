import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from "react-router-dom";
import { VerticalAlignBottom, AddCircleOutline, Settings } from '@styled-icons/material';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import { Home } from '@styled-icons/fa-solid'
import { SendPlane } from '@styled-icons/remix-fill';

import { StyledIcon } from '.';

import { blue, white, offWhite, darkGray, darkOffWhite, lightBlue, lightBlack } from '../utils/colors';
import { mobile } from '../utils/media';


export const NavLinks = ({ config, setCurrentAccount, loading }) => {
  const { pathname } = useLocation();

  return (
    <Fragment>
      <SidebarItem active={pathname === '/'} to="/" loading={false}>
        <StyledIcon as={Home} size={24} style={{ marginRight: 12 }} />
          Home
        </SidebarItem>
      <SidebarItemLink active={pathname === '/send'} to="/send" loading={loading}>
        <StyledIcon as={SendPlane} size={24} style={{ marginRight: 12 }} />
          Send
        </SidebarItemLink>
      <SidebarItemLink active={pathname === '/receive'} to="/receive" loading={loading}>
        <StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 12 }} />
            Receive
        </SidebarItemLink>
      <SidebarItemLink active={pathname === '/settings'} to="/settings" loading={loading}>
        <StyledIcon as={Settings} size={24} style={{ marginRight: 12 }} />
            Settings
        </SidebarItemLink>

      <WalletsHeader>Accounts</WalletsHeader>
      <AccountsContainer>
        {
          config.wallets.map((wallet) => (
            <SidebarItemLink
              key={wallet.id}
              active={pathname === `/vault/${wallet.id}`}
              onClick={() => {
                setCurrentAccount(wallet.id);
              }}
              to={`/vault/${wallet.id}`}
              loading={loading}
            >
              <StyledIcon as={Wallet} size={24} style={{ marginRight: 12 }} />
              {wallet.name}</SidebarItemLink>
          ))
        }

        {
          config.vaults.map((vault) => (
            <SidebarItemLink
              key={vault.id}
              active={pathname === `/vault/${vault.id}`}
              onClick={() => {
                setCurrentAccount(vault.id);
              }}
              to={`/vault/${vault.id}`}
              loading={loading}
            >
              <StyledIcon as={Safe} size={24} style={{ marginRight: 12 }} />
              {vault.name}</SidebarItemLink>
          ))
        }
      </AccountsContainer>

      <SidebarItemLink
        active={pathname === '/setup'}
        to={`/setup`}
        loading={false}>
        <StyledIcon as={AddCircleOutline} size={24} style={{ marginRight: 12 }} />
          New Account
          </SidebarItemLink>
    </Fragment >
  )
}

const AccountsContainer = styled.div`
  overflow: scroll;
  height: auto;
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
  align-items: center;

  ${mobile(css`
    border-left: none;
    border-top: ${ p => p.active ? `solid 0.6875em ${blue}` : 'none'};
    margin-top: ${ p => p.active ? `solid 0.6875em ${blue}` : 'none'};
    align-items: center;
  `)};

  &:hover {
    background: ${offWhite};
  }
`;

const SidebarItem = styled(Link)`
  ${SidebarItemStyle};
`;


const SidebarItemLink = styled(Link)`
  ${SidebarItemStyle};
  text-decoration: none;
  cursor: ${p => p.loading ? 'wait' : 'pointer'};
  pointer-events: ${p => p.loading ? 'none' : 'auto'};
`;

const WalletsHeader = styled.h3`
  color: ${lightBlack};
  margin: 2.125em 1.125em .25em;
  font-size: 1em;
  font-weight: 100;
`;