import React, { useState, Fragment, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Circle } from "@styled-icons/boxicons-solid";

import {
  white,
  green400,
  orange400,
  red500,
  green800,
  green900,
} from "../utils/colors";

import { AccountMapContext } from "../AccountMapContext";

import { getNodeStatus } from "../utils/other";

import { StyledIcon, Dropdown, ConnectToLilyMobileModal } from ".";

import { NodeConfig, LilyConfig } from "../types";

interface Props {
  nodeConfig: NodeConfig | undefined; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  config: LilyConfig;
  resetConfigFile: () => void;
}

export const TitleBar = ({ nodeConfig, config, resetConfigFile }: Props) => {
  const [moreOptionsDropdownOpen, setMoreOptionsDropdownOpen] = useState(false);
  const [nodeOptionsDropdownOpen, setNodeOptionsDropdownOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const history = useHistory();
  const { setCurrentAccountId } = useContext(AccountMapContext);

  const nodeConfigDropdownItems = [];

  nodeConfigDropdownItems.push({
    label: (
      <Fragment>
        Status: <br />
        {getNodeStatus(nodeConfig)}
      </Fragment>
    ),
  });

  nodeConfigDropdownItems.push({});
  nodeConfigDropdownItems.push({
    label: "Network Settings",
    onClick: () => history.push("/settings", { currentTab: "network" }),
  });

  const moreOptionsDropdownItems = [
    {
      label: "Support",
      onClick: () => {
        window.open("https://docs.lily.kevinmulcrone.com", "_blank");
      },
    },
    {
      label: "View source code",
      onClick: () => {
        window.open("https://github.com/KayBeSee/lily-wallet", "_blank");
      },
    },
  ] as { label?: string; onClick?: () => void; onlyMobile?: boolean }[];

  if (!config.isEmpty) {
    moreOptionsDropdownItems.unshift(
      {
        label: "Home",
        onClick: () => history.push("/"),
        onlyMobile: true,
      },
      {
        label: "Send",
        onClick: () => history.push("/send"),
        onlyMobile: true,
      },
      {
        label: "Receive",
        onClick: () => history.push("/receive"),
        onlyMobile: true,
      },
      {
        label: "Settings",
        onClick: () => history.push("/settings"),
        onlyMobile: true,
      },
      { onlyMobile: true },
      ...config.wallets.map((wallet) => ({
        label: wallet.name,
        onClick: () => {
          history.push(`/vault/${wallet.id}`);
          setCurrentAccountId(wallet.id);
        },
        onlyMobile: true,
      })),
      ...config.vaults.map((vault) => ({
        label: vault.name,
        onClick: () => {
          history.push(`/vault/${vault.id}`);
          setCurrentAccountId(vault.id);
        },
        onlyMobile: true,
      })),
      {
        label: "New Account",
        onClick: () => history.push("/setup"),
        onlyMobile: true,
      },
      { onlyMobile: true }
    );
    moreOptionsDropdownItems.push(
      // { KBC-TODO: re-add when mobile app
      //   label: "Connect to Lily Mobile",
      //   onClick: () => {
      //     setConfigModalOpen(true);
      //   },
      // },
      {
        label: "Sign out",
        onClick: async () => {
          await resetConfigFile();
        },
      }
    );
  }

  return (
    <Fragment>
      <HeightHolder />
      <DraggableTitleBar>
        <ConnectToLilyMobileModal
          isOpen={configModalOpen}
          onRequestClose={() => setConfigModalOpen(false)}
          config={config}
        />
        <LeftSection></LeftSection>
        <RightSection>
          <NodeButtonContainer>
            <Dropdown
              isOpen={nodeOptionsDropdownOpen}
              setIsOpen={setNodeOptionsDropdownOpen}
              minimal={false}
              style={{
                background: green900,
                color: white,
                padding: "0.35em 1em",
                border: "none",
                fontFamily: "Montserrat, sans-serif",
                display: "flex",
                alignItems: "center",
              }}
              buttonLabel={
                <Fragment>
                  {nodeConfig ? (
                    <StyledIcon
                      as={Circle}
                      style={{
                        color: nodeConfig.initialblockdownload
                          ? orange400
                          : nodeConfig.connected
                          ? green400
                          : red500, // !nodeConfig.connected
                      }}
                    />
                  ) : (
                    <LoadingImage
                      alt="loading placeholder"
                      src={require("../assets/flower-loading.svg")}
                    />
                  )}
                  {nodeConfig && nodeConfig.connected
                    ? null
                    : nodeConfig && !nodeConfig.connected
                    ? null
                    : "Connecting..."}
                </Fragment>
              }
              dropdownItems={nodeConfigDropdownItems}
            />
          </NodeButtonContainer>

          <DotDotDotContainer>
            <Dropdown
              style={{ color: white }}
              isOpen={moreOptionsDropdownOpen}
              setIsOpen={setMoreOptionsDropdownOpen}
              minimal={true}
              dropdownItems={moreOptionsDropdownItems}
            />
          </DotDotDotContainer>
        </RightSection>
      </DraggableTitleBar>
    </Fragment>
  );
};

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-right: 0.25em;
  opacity: 0.9;
`;

const LeftSection = styled.div`
  display: flex;
  margin-left: 1em;
`;
const RightSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const DotDotDotContainer = styled.div`
  margin: 0 1em 0 0;
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
`;

const DraggableTitleBar = styled.div`
  position: fixed;
  background: ${green800};
  -webkit-user-select: none;
  -webkit-app-region: drag;
  height: 2.5rem;
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Montserrat, sans-serif;
`;

const HeightHolder = styled.div`
  height: 2.5rem;
  z-index: 0;
  background: transparent;
`;

const NodeButtonContainer = styled.div`
  margin: 0 0.25em;
  -webkit-app-region: no-drag;
`;
