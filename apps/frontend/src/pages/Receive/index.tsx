import React, { Fragment, useContext, useEffect } from 'react';

import {
  PageWrapper,
  PageTitle,
  Header,
  HeaderRight,
  HeaderLeft,
  NoAccountsEmptyState
} from 'src/components';

import { AccountMapContext } from 'src/context/AccountMapContext';

import OnchainReceive from './OnchainReceive';
import LightningReceive from './Lightning';

const Receive = () => {
  const { accountMap, currentAccount, setCurrentAccountId } = useContext(AccountMapContext);
  const hasAccount = Object.keys(accountMap).length > 0;

  useEffect(() => {
    if (currentAccount.name === 'Loading...' && hasAccount) {
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
