import React, { Fragment } from 'react';
import { Network } from 'bitcoinjs-lib';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { PageWrapper } from '../../components';

import VaultView from './VaultView';
import VaultSettings from './Settings';
import VaultHeader from './VaultHeader';

import { NodeConfigWithBlockchainInfo } from '@lily/types';

interface Props {
  nodeConfig: NodeConfigWithBlockchainInfo;
  password: string;
  toggleRefresh(): void;
  currentBitcoinNetwork: Network;
}

const Vault = ({ nodeConfig, password, toggleRefresh, currentBitcoinNetwork }: Props) => {
  let { path } = useRouteMatch();

  return (
    <PageWrapper>
      <Fragment>
        <VaultHeader toggleRefresh={toggleRefresh} />
        <Switch>
          <Route
            path={`${path}/settings`}
            render={() => (
              <VaultSettings
                password={password}
                nodeConfig={nodeConfig}
                currentBitcoinNetwork={currentBitcoinNetwork}
              />
            )}
          />
          <Route
            path=''
            render={() => <VaultView nodeConfig={nodeConfig} toggleRefresh={toggleRefresh} />}
          />
        </Switch>
      </Fragment>
    </PageWrapper>
  );
};

export default Vault;