import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { VerticalAlignBottom, AddCircleOutline } from '@styled-icons/material';
import { SendPlane } from '@styled-icons/remix-fill';
import { networks, Network } from 'bitcoinjs-lib';
import FlowerLogo from 'src/assets/flower.svg';

import { StyledIcon } from '.';

import { AccountMapContext, ConfigContext, SidebarContext } from 'src/context';

import { gray700, gray900 } from 'src/utils/colors';
import { bitcoinNetworkEqual } from 'src/utils/files';
import { classNames } from 'src/utils/other';

interface Props {
  currentBitcoinNetwork: Network;
}

export const NavLinks = ({ currentBitcoinNetwork }: Props) => {
  const { pathname } = useLocation();
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const { config } = useContext(ConfigContext);
  const { setSidebarOpen } = useContext(SidebarContext);

  return (
    <>
      <WalletTitle>
        {bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ? (
          <LilyImageGray src={FlowerLogo} />
        ) : (
          <LilyImage src={FlowerLogo} />
        )}
        <WalletTitleText className='dark:text-gray-200'>
          Lily Wallet
          {bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) && ' (testnet)'}
        </WalletTitleText>
      </WalletTitle>
      <Link
        className={classNames(pathname === '/' ? 'sidebar-item__active' : '', 'sidebar-item')}
        data-cy='nav-item'
        onClick={() => setSidebarOpen(false)}
        to='/'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='w-6 h-6 mr-2 text-gray-600'
        >
          <path d='M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z' />
          <path d='M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z' />
        </svg>
        Home
      </Link>
      <Link
        className={classNames(pathname === '/send' ? 'sidebar-item__active' : '', 'sidebar-item')}
        data-cy='nav-item'
        onClick={() => setSidebarOpen(false)}
        to='/send'
      >
        <StyledIcon as={SendPlane} size={24} style={{ marginRight: '.65rem', color: gray700 }} />
        Send
      </Link>
      <Link
        className={classNames(
          pathname === '/receive' ? 'sidebar-item__active' : '',
          'sidebar-item'
        )}
        data-cy='nav-item'
        onClick={() => setSidebarOpen(false)}
        to='/receive'
      >
        <StyledIcon
          as={VerticalAlignBottom}
          size={24}
          style={{ marginRight: '.65rem', color: gray700 }}
        />
        Receive
      </Link>
      <Link
        className={classNames(
          pathname === '/settings' ? 'sidebar-item__active' : '',
          'sidebar-item'
        )}
        data-cy='nav-item'
        onClick={() => setSidebarOpen(false)}
        to='/settings'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          className='w-6 h-6 mr-2 text-gray-600'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495'
          />
        </svg>
        Settings
      </Link>

      <h3 className='font-semibold text-lg mx-4 mt-7 mb-2 dark:text-gray-300'>Accounts</h3>
      <ul>
        {config.lightning.map((wallet) => (
          <Link
            className={classNames(
              pathname.includes(`/lightning/${wallet.id}`) ? 'sidebar-item__active' : '',
              'sidebar-item'
            )}
            data-cy='nav-item'
            key={wallet.id}
            onClick={() => {
              setCurrentAccountId(wallet.id);
              setSidebarOpen(false);
            }}
            to={`/lightning/${wallet.id}`}
          >
            <IconSvg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </IconSvg>
            {wallet.name}
          </Link>
        ))}

        {config.wallets.map((wallet) => (
          <Link
            className={classNames(
              pathname.includes(`/vault/${wallet.id}`) ? 'sidebar-item__active' : '',
              'sidebar-item'
            )}
            data-cy='nav-item'
            key={wallet.id}
            onClick={() => {
              setCurrentAccountId(wallet.id);
              setSidebarOpen(false);
            }}
            to={`/vault/${wallet.id}`}
          >
            {wallet.mnemonic ? (
              <IconSvg fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z'
                  clipRule='evenodd'
                ></path>
              </IconSvg>
            ) : (
              <IconSvg viewBox='0 0 20 20' fill='currentColor' className='calculator w-6 h-6'>
                <path
                  fillRule='evenodd'
                  d='M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z'
                  clipRule='evenodd'
                ></path>
              </IconSvg>
            )}
            {wallet.name}
          </Link>
        ))}

        {config.vaults.map((vault) => (
          <Link
            className={classNames(
              pathname.includes(`/vault/${vault.id}`) ? 'sidebar-item__active' : '',
              'sidebar-item'
            )}
            data-cy='nav-item'
            key={vault.id}
            onClick={() => {
              setCurrentAccountId(vault.id);
              setSidebarOpen(false);
            }}
            to={`/vault/${vault.id}`}
          >
            <IconSvg fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z'
                clipRule='evenodd'
              ></path>
            </IconSvg>
            {vault.name}
          </Link>
        ))}
      </ul>

      <Link
        className={classNames(pathname === '/setup' ? 'sidebar-item__active' : '', 'sidebar-item')}
        data-cy='nav-item'
        onClick={() => setSidebarOpen(false)}
        to={`/setup`}
      >
        <StyledIcon
          as={AddCircleOutline}
          size={24}
          style={{ marginRight: '.65rem', color: gray700 }}
        />
        New Account
      </Link>
    </>
  );
};

const WalletTitleText = styled.span`
  margin-left: 0.15em;
  margin-top: 0.25em;
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 0.25em;
`;

const LilyImageGray = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 0.25em;
  filter: grayscale(100%);
`;

const WalletsHeader = styled.h3`
  color: ${gray900};
  margin: 1.125em 1.125em 0.925em 0.75em;
  font-size: 1.125em;
  font-weight: 500;
`;

const WalletTitle = styled(WalletsHeader)`
  display: flex;
  align-items: center;
  padding: 1em 0.75em;
  font-weight: 700;
  margin: 0;
`;

const IconSvg = styled.svg`
  color: ${gray700};
  width: 1.25rem;
  margin-right: 0.65rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const AccountsContainer = styled.div`
  overflow: auto;
  height: auto;
`;
