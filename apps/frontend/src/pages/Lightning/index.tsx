import React, { Fragment } from 'react';
import { Network } from 'bitcoinjs-lib';
import { Switch, Route, useRouteMatch, RouteComponentProps } from 'react-router-dom';

import { PageWrapper } from 'src/components';

import LightningHeader from './LightningHeader';
import LightningView from './LightningView';
import LightningSettings from './Settings';

interface Props {
  password: string;
  toggleRefresh(): void;
  currentBitcoinNetwork: Network;
}

const Lightning = ({ password, toggleRefresh, currentBitcoinNetwork }: Props) => {
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
