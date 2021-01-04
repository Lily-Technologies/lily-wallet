import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { Network } from "bitcoinjs-lib";

import { PageWrapper, PageTitle, Header, HeaderLeft } from "../../components";

import Tabs from "./Tabs";
import ConfigurationSettings from "./ConfigurationSettings";
import License from "./License";
import About from "./About";

import { white } from "../../utils/colors";

import { LilyConfig, NodeConfig } from "../../types";

interface Props {
  config: LilyConfig;
  nodeConfig: NodeConfig;
  currentBitcoinNetwork: Network;
}

const Settings = ({ config, nodeConfig, currentBitcoinNetwork }: Props) => {
  const [currentTab, setCurrentTab] = useState("config");

  return (
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Settings</PageTitle>
          </HeaderLeft>
        </Header>
        <Wrapper>
          <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
          {currentTab === "config" && (
            <ConfigurationSettings
              config={config}
              nodeConfig={nodeConfig}
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
          )}
          {currentTab === "license" && (
            <License config={config} nodeConfig={nodeConfig} />
          )}
          {currentTab === "about" && <About config={config} />}
        </Wrapper>
      </Fragment>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  padding: 1.5rem;
`;

export default Settings;
