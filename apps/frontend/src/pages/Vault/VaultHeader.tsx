import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { VerticalAlignBottom, ArrowUpward, Settings, Refresh } from '@styled-icons/material';
import FlowerLoading from 'src/assets/flower-loading.svg';

import { StyledIcon, PageTitle, Header, HeaderLeft, Dropdown } from 'src/components';

import { gray300 } from 'src/utils/colors';
import { LilyOnchainAccount } from '@lily/types';

import { AccountMapContext } from 'src/context';

interface Props {
  toggleRefresh(): void;
}

const VaultHeader = ({ toggleRefresh }: Props) => {
  const history = useHistory();
  let { url } = useRouteMatch();
  const currentAccount = useContext(AccountMapContext).currentAccount as LilyOnchainAccount;

  let HeadingComponent;
  if (currentAccount.config.quorum.totalSigners > 1) {
    HeadingComponent = (
      <Fragment>
        <IconSvg fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z'
            clipRule='evenodd'
          ></path>
        </IconSvg>
        {currentAccount.config.quorum.requiredSigners} of{' '}
        {currentAccount.config.quorum.totalSigners} Multisignature Vault
      </Fragment>
    );
  } else if (currentAccount.config.quorum.totalSigners === 1 && currentAccount.config.mnemonic) {
    HeadingComponent = (
      <Fragment>
        <IconSvg fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z'
            clipRule='evenodd'
          ></path>
        </IconSvg>
        <span>Hot Wallet</span>
      </Fragment>
    );
  } else if (currentAccount.config.quorum.totalSigners === 1 && !currentAccount.config.mnemonic) {
    HeadingComponent = (
      <Fragment>
        <IconSvg viewBox='0 0 20 20' fill='currentColor' className='calculator w-6 h-6'>
          <path
            fillRule='evenodd'
            d='M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z'
            clipRule='evenodd'
          ></path>
        </IconSvg>
        <span>Hardware Wallet</span>
      </Fragment>
    );
  }

  return (
    <Header className='space-y-4'>
      <div className='flex flex-col space-y-1'>
        <Link
          className='text-4xl font-semibold hover:text-gray-100 active:text-gray-200 cursor-pointer'
          to={url}
        >
          {currentAccount.name}
        </Link>
        <div className='flex items-center text-sm font-medium text-gray-300'>
          {HeadingComponent}
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        <Link
          to='/send'
          className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2  focus:ring-green-500'
        >
          <StyledIcon
            as={ArrowUpward}
            size={24}
            style={{ marginRight: '.5rem', marginLeft: '-0.25rem' }}
          />
          Send
        </Link>
        <Link
          to='/receive'
          className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2  focus:ring-green-500'
        >
          <StyledIcon
            as={VerticalAlignBottom}
            size={24}
            style={{ marginRight: '.5rem', marginLeft: '-0.25rem' }}
          />
          Receive
        </Link>
        {!currentAccount.loading && (
          <button
            onClick={() => toggleRefresh()}
            className='hidden md:flex items-center overflow-hidden justify-center w-10 h-10 outline-none hover:text-gray-200 active:text-gray-300 focus:ring-2 focus:ring-green-500 rounded-full'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className='w-8 h-8'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
              />
            </svg>
          </button>
        )}
        {currentAccount.loading && <LoadingImage className='hidden md:block' src={FlowerLoading} />}
        <Link
          to={`${url}/settings`}
          className='hidden md:block outline-none hover:text-gray-200 active:text-gray-300 focus:ring-2 focus:ring-green-500 rounded-full'
          data-cy='settings'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='w-10 h-10'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495'
            />
          </svg>
        </Link>
        <Dropdown
          className='inline-block md:hidden text-white ml-2 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1'
          dropdownItems={[
            { label: 'Refresh', onClick: () => toggleRefresh() },
            { label: 'Settings', onClick: () => history.push(`${url}/settings`) }
          ]}
          minimal
        ></Dropdown>
      </div>
    </Header>
  );
};

const IconSvg = styled.svg`
  color: ${gray300};
  width: 1.25rem;
  margin-right: 0.375rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 2em;
  margin: 0 0.5em 0 0.75em;
`;

const VaultExplainerText = styled.div`
  color: ${gray300};
  display: flex;
  align-items: center;
  margin-top: 0.5em;
  font-weight: 500;
  font-size: 0.85em;
`;

export default VaultHeader;
