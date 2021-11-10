import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { VerticalAlignBottom, ArrowUpward, Settings, Refresh } from '@styled-icons/material';

import { AccountMapContext } from 'src/context/AccountMapContext';

import { StyledIcon, Button, PageTitle, Header, HeaderRight, HeaderLeft } from 'src/components';

import { white, gray300, green900 } from 'src/utils/colors';

interface Props {
  toggleRefresh(): void;
}

const LightningHeader = ({ toggleRefresh }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const history = useHistory();
  let { url } = useRouteMatch();

  return (
    <Header>
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
              stroke-width='2'
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </IconSvg>
          Lightning Wallet
        </VaultExplainerText>
      </HeaderLeft>
      <HeaderRight>
        <SendButton to='/send' color={white} background={green900}>
          <StyledIcon
            as={ArrowUpward}
            size={24}
            style={{ marginRight: '.5rem', marginLeft: '-0.25rem' }}
          />
          Send
        </SendButton>
        <ReceiveButton to='/receive' color={white} background={green900}>
          <StyledIcon
            as={VerticalAlignBottom}
            size={24}
            style={{ marginRight: '.5rem', marginLeft: '-0.25rem' }}
          />
          Receive
        </ReceiveButton>
        {!currentAccount.loading && (
          <RefreshButton onClick={() => toggleRefresh()} color={white} background={'transparent'}>
            <StyledIcon as={Refresh} size={36} />
          </RefreshButton>
        )}
        {currentAccount.loading && (
          <LoadingImage
            alt='loading placeholder'
            src={require('../../assets/flower-loading.svg')}
          />
        )}
        <SettingsButton
          to={`${url}/settings`}
          color={white}
          background={'transparent'}
          data-cy='settings'
        >
          <StyledIcon as={Settings} size={36} />
        </SettingsButton>
      </HeaderRight>
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

const SendButton = styled(Link)`
  ${Button}
  margin: 12px;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
`;

const ReceiveButton = styled(Link)`
  ${Button}
  margin: 12px;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
`;

const SettingsButton = styled(Link)`
  ${Button}
  border-radius: 25%;
`;

const RefreshButton = styled.button`
  ${Button}
  border-radius: 25%;
  padding-left: 0;
  padding-right: 0;
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
