import React, { useContext } from 'react';
import { Network } from 'bitcoinjs-lib';

import { PageWrapper, PageTitle, Header, HeaderRight, HeaderLeft, Loading } from 'src/components';
import { SelectAccountMenu, NoAccountsEmptyState } from 'src/components';

import { AccountMapContext } from 'src/context/AccountMapContext';

import SendOnchain from './Onchain';
import SendLightning from './Lightning';

import { LilyConfig, NodeConfigWithBlockchainInfo } from 'src/types';

interface Props {
  config: LilyConfig;
  currentBitcoinNetwork: Network;
  nodeConfig: NodeConfigWithBlockchainInfo;
  currentBitcoinPrice: any; // KBC-TODO: more specific type
}

const Send = ({ config, currentBitcoinNetwork, nodeConfig, currentBitcoinPrice }: Props) => {
  document.title = `Send - Lily Wallet`;

  const { accountMap, currentAccount } = useContext(AccountMapContext);

  return (
    <PageWrapper>
      <>
        <Header>
          <HeaderLeft>
            <PageTitle>Send from</PageTitle>
          </HeaderLeft>
          <HeaderRight></HeaderRight>
        </Header>
        {Object.keys(accountMap).length > 0 && (
          <SelectAccountMenu config={config} excludeNonSegwitAccounts={false} />
        )}
        {Object.keys(accountMap).length === 0 && <NoAccountsEmptyState />}
        {Object.keys(accountMap).length > 0 && currentAccount.loading && (
          <Loading itemText={'Send Information'} />
        )}

        {currentAccount.config.type === 'onchain' && (
          <SendOnchain
            config={config}
            currentBitcoinNetwork={currentBitcoinNetwork}
            nodeConfig={nodeConfig}
            currentBitcoinPrice={currentBitcoinPrice}
          />
        )}
        {currentAccount.config.type === 'lightning' && <SendLightning />}
      </>
    </PageWrapper>
  );
};

export default Send;
