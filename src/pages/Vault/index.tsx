import React, { Fragment } from "react";
import { Network } from "bitcoinjs-lib";
import {
  Switch,
  Route,
  useRouteMatch,
  RouteComponentProps,
} from "react-router-dom";

import { PageWrapper } from "../../components";

import VaultView from "./VaultView";
import VaultSettings from "./Settings";
import VaultHeader from "./VaultHeader";

import { NodeConfig } from "../../types";

interface Props {
  nodeConfig: NodeConfig;
  password: string;
  toggleRefresh(): void;
  currentBitcoinNetwork: Network;
}

const Vault = ({
  nodeConfig,
  password,
  toggleRefresh,
  currentBitcoinNetwork,
}: Props) => {
  document.title = `Vault - Lily Wallet`;
  let { path } = useRouteMatch();

  return (
    <PageWrapper>
      <Fragment>
        <VaultHeader toggleRefresh={toggleRefresh} />
        <Switch>
          <Route
            path={`${path}/settings`}
            render={(props: RouteComponentProps) => (
              <VaultSettings
                match={props.match}
                password={password}
                currentBitcoinNetwork={currentBitcoinNetwork}
              />
            )}
          />
          <Route
            path=""
            render={() => (
              <VaultView
                nodeConfig={nodeConfig}
                toggleRefresh={toggleRefresh}
              />
            )}
          />
        </Switch>
      </Fragment>
    </PageWrapper>
  );
};

export default Vault;
