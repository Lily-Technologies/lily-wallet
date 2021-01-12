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

import { LilyConfig, NodeConfig } from "../../types";

interface Props {
  config: LilyConfig;
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>;
  nodeConfig: NodeConfig;
  password: string;
  toggleRefresh(): void;
  currentBitcoinNetwork: Network;
}

const Vault = ({
  config,
  setConfigFile,
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
                config={config}
                setConfigFile={setConfigFile}
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
