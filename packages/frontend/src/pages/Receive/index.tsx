import React, { Fragment, useContext } from 'react';

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
  const { accountMap, currentAccount } = useContext(AccountMapContext);

  return (
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Receive to</PageTitle>
          </HeaderLeft>
          <HeaderRight></HeaderRight>
        </Header>

        {Object.keys(accountMap).length > 0 && (
          <SelectAccountMenu config={config} excludeNonSegwitAccounts={false} />
        )}
        {Object.keys(accountMap).length === 0 && <NoAccountsEmptyState />}
        {Object.keys(accountMap).length > 0 && currentAccount.loading && (
          <Loading itemText={'Receive Information'} />
        )}
        {!currentAccount.loading && currentAccount.config.type === 'onchain' && <OnchainReceive />}
        {!currentAccount.loading && currentAccount.config.type === 'lightning' && (
          <LightningReceive />
        )}
      </Fragment>
    </PageWrapper>
  );
};

export default Receive;
