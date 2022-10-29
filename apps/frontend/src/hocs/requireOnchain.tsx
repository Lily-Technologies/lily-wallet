// @ts-nocheck
import React, { useContext } from 'react';
import { LilyOnchainAccount } from '@lily/types';
import { AccountMapContext } from 'src/context/AccountMapContext';
import { ConfigContext } from 'src/context/ConfigContext';

interface RequireOnchainProps {
  currentAccount: LilyOnchainAccount;
}

export function requireOnchain<T extends RequireOnchainProps = RequireOnchainProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithOnchainAccount = (props: Omit<T, keyof RequireOnchainProps>) => {
    const { currentAccount, setCurrentAccountId } = useContext(AccountMapContext);
    const { config } = useContext(ConfigContext);

    if (currentAccount.config.type !== 'onchain' && !!config.vaults[0]) {
      setCurrentAccountId(config.vaults[0].id);
    } else if (currentAccount.config.type !== 'onchain' && !!config.wallets[0]) {
      setCurrentAccountId(config.wallets[0].id);
    }

    return <WrappedComponent {...{ currentAccount }} {...(props as T)} />;
  };

  ComponentWithOnchainAccount.displayName = `requireOnchain(${displayName})`;

  return ComponentWithOnchainAccount;
}
