import React, { Fragment } from 'react';
import { Network } from 'bitcoinjs-lib';
import { Switch, Route, useRouteMatch, RouteComponentProps } from 'react-router-dom';

import { PageWrapper } from 'src/components';

import LightningHeader from './LightningHeader';
import LightningView from './LightningView';
import LightningSettings from './Settings';

import { NodeConfigWithBlockchainInfo } from 'src/types';

interface Props {
  nodeConfig: NodeConfigWithBlockchainInfo;
  password: string;
  toggleRefresh(): void;
  currentBitcoinNetwork: Network;
}

const Lightning = ({ nodeConfig, password, toggleRefresh, currentBitcoinNetwork }: Props) => {
  document.title = `Lightning - Lily Wallet`;
  let { path } = useRouteMatch();

  return (
    <PageWrapper>
      <Fragment>
        <LightningHeader toggleRefresh={toggleRefresh} />
        <Switch>
          <Route
            path={`${path}/settings`}
            render={(props: RouteComponentProps) => (
              <LightningSettings
                password={password}
                nodeConfig={nodeConfig}
                currentBitcoinNetwork={currentBitcoinNetwork}
              />
            )}
          />
          <Route path='' render={() => <LightningView />} />
        </Switch>
      </Fragment>
    </PageWrapper>
  );
};

export default Lightning;
