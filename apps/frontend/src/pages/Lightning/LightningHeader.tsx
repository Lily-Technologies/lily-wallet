import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { VerticalAlignBottom, ArrowUpward, Settings, Refresh } from '@styled-icons/material';
import FlowerLoading from 'src/assets/flower-loading.svg';

import { AccountMapContext } from 'src/context/AccountMapContext';

import { StyledIcon, PageTitle, Header, Dropdown, HeaderLeft } from 'src/components';

import { gray300 } from 'src/utils/colors';

interface Props {
  toggleRefresh(): void;
}

const LightningHeader = ({ toggleRefresh }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const history = useHistory();
  let { url } = useRouteMatch();

  return (
    <Header className='space-y-4'>
      <HeaderLeft>
        <PageTitle style={{ cursor: 'pointer' }} onClick={() => history.push(url)}>
          {currentAccount.name}
        </PageTitle>
        <VaultExplainerText>
          <IconSvg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              strokeWidth='2'
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </IconSvg>
          Lightning Wallet
        </VaultExplainerText>
      </HeaderLeft>
      <div className='flex items-center'>
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
          className='ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2  focus:ring-green-500'
        >
          <StyledIcon
            as={VerticalAlignBottom}
            size={24}
            style={{ marginRight: '.5rem', marginLeft: '-0.25rem' }}
          />
          Receive
        </Link>
        {!currentAccount.loading && (
          <button onClick={() => toggleRefresh()} className='hidden md:block mx-4'>
            <StyledIcon as={Refresh} size={36} />
          </button>
        )}
        {currentAccount.loading && (
          <LoadingImage
            className='hidden md:block mx-4'
            alt='loading placeholder'
            src={FlowerLoading}
          />
        )}
        <Link to={`${url}/settings`} className='hidden md:block mx-4' data-cy='settings'>
          <StyledIcon as={Settings} size={36} />
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

export default LightningHeader;
