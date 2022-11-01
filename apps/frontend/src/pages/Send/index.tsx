import React, { useEffect, useContext } from 'react';
import { Network } from 'bitcoinjs-lib';

import { PageWrapper, PageTitle, Header, HeaderRight, HeaderLeft } from 'src/components';
import { NoAccountsEmptyState } from 'src/components';

import { AccountMapContext } from 'src/context/AccountMapContext';

import SendOnchain from './Onchain';
import SendLightning from './Lightning';

import {
  LilyConfig,
  NodeConfigWithBlockchainInfo,
  LilyLightningAccount,
  LilyOnchainAccount
} from '@lily/types';

interface Props {
  config: LilyConfig;
  currentBitcoinNetwork: Network;
  nodeConfig: NodeConfigWithBlockchainInfo;
  currentBitcoinPrice: any; // KBC-TODO: more specific type
}

const Send = ({ config, currentBitcoinNetwork, nodeConfig, currentBitcoinPrice }: Props) => {
  const { accountMap, currentAccount, setCurrentAccountId } = useContext(AccountMapContext);
  const hasAccount = Object.keys(accountMap).length > 0;

  useEffect(() => {
    if (currentAccount.name === 'Loading...' && hasAccount) {
      setCurrentAccountId(Object.keys(accountMap)[0]);
    }
  }, []);

  return (
    <PageWrapper>
      <>
        {!hasAccount && (
          <>
            <Header>
              <HeaderLeft>
                <PageTitle>Send bitcoin</PageTitle>
              </HeaderLeft>
              <HeaderRight></HeaderRight>
            </Header>
            <NoAccountsEmptyState />
          </>
        )}

        {currentAccount.config.type === 'onchain' && (
          <SendOnchain
            config={config}
            currentBitcoinNetwork={currentBitcoinNetwork}
            nodeConfig={nodeConfig}
            currentBitcoinPrice={currentBitcoinPrice}
            currentAccount={currentAccount as LilyOnchainAccount}
          />
        )}
        {currentAccount.config.type === 'lightning' && (
          <SendLightning currentAccount={currentAccount as LilyLightningAccount} />
        )}
      </>
    </PageWrapper>
  );
};

export default Send;
