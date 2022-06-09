import React, { Fragment } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { PageWrapper } from 'src/components';

import LightningHeader from './LightningHeader';
import LightningView from './LightningView';
import LightningSettings from './Settings';

interface Props {
  toggleRefresh(): void;
}

const Lightning = ({ toggleRefresh }: Props) => {
  let { path } = useRouteMatch();

  return (
    <PageWrapper>
      <Fragment>
        <LightningHeader toggleRefresh={toggleRefresh} />
        <Switch>
          <Route path={`${path}/settings`} render={() => <LightningSettings />} />
          <Route path='' render={() => <LightningView />} />
        </Switch>
      </Fragment>
    </PageWrapper>
  );
};

export default Lightning;
