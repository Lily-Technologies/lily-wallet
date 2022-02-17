import React, { Fragment, useContext, useEffect } from 'react';

import {
  PageWrapper,
  PageTitle,
  Header,
  HeaderRight,
  HeaderLeft,
  Loading,
  SelectAccountMenu,
  NoAccountsEmptyState
} from 'src/components';

import { AccountMapContext } from 'src/context/AccountMapContext';

import OnchainReceive from './OnchainReceive';
import LightningReceive from './Lightning';

import { LilyConfig } from '@lily/types';

interface Props {
  config: LilyConfig;
}

const Receive = ({ config }: Props) => {
  const { accountMap, currentAccount, setCurrentAccountId } = useContext(AccountMapContext);
  const hasAccount = Object.keys(accountMap).length > 0;
  console.log('hasAccount: ', hasAccount);
  console.log('currentAccount: ', currentAccount);
  console.log('!currentAccount: ', !currentAccount);

  useEffect(() => {
    console.log('hits useEffect');
    if (currentAccount.name === 'Loading...' && hasAccount) {
      console.log('Object.keys(accountMap)[0]: ', Object.keys(accountMap)[0]);
      setCurrentAccountId(Object.keys(accountMap)[0]);
    }
  }, []);

  return (
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Receive bitcoin</PageTitle>
          </HeaderLeft>
          <HeaderRight></HeaderRight>
        </Header>

        {!hasAccount && <NoAccountsEmptyState />}
        {currentAccount.config.type === 'onchain' && <OnchainReceive />}
        {currentAccount.config.type === 'lightning' && <LightningReceive />}
      </Fragment>
    </PageWrapper>
  );
};

export default Receive;
