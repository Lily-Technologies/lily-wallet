import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { Circle } from "@styled-icons/boxicons-solid";
import { Menu } from "@styled-icons/boxicons-regular";

import {
  white,
  green400,
  orange400,
  red500,
  green800,
  green900,
} from "../utils/colors";

import { getNodeStatus } from "../utils/other";
import { mobile } from "../utils/media";

import { StyledIcon, Dropdown, ConnectToLilyMobileModal } from ".";

import { NodeConfig, LilyConfig, SetStateBoolean } from "../types";

interface Props {
  nodeConfig: NodeConfig | undefined; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  setMobileNavOpen: SetStateBoolean;
  config: LilyConfig;
  resetConfigFile: () => void;
}

export const TitleBar = ({
  nodeConfig,
  setMobileNavOpen,
  config,
  resetConfigFile,
}: Props) => {
  const [moreOptionsDropdownOpen, setMoreOptionsDropdownOpen] = useState(false);
  const [nodeOptionsDropdownOpen, setNodeOptionsDropdownOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const history = useHistory();

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
  // nodeConfigDropdownItems.push({});
  nodeConfigDropdownItems.push({
    label: "Network Settings",
    onClick: () => history.push("settings", { currentTab: "network" }),
  });

  const moreOptionsDropdownItems = [
    {
      label: "Support",
      onClick: () => {
        console.log("foobar");
      },
    },
    {
      label: "View source code",
      onClick: () => {
        window.open(
          "https://github.com/KayBeSee/lily-wallet",
          "_blank",
          "nodeIntegration=no"
        );
      },
    },
  ];

  if (!config.isEmpty) {
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
        <LeftSection>
          {!config.isEmpty && (
            <MobileMenuOpen onClick={() => setMobileNavOpen(true)}>
              <StyledIcon as={Menu} size={36} /> Menu
            </MobileMenuOpen>
          )}
        </LeftSection>
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

const MobileMenuOpen = styled.div`
  display: none;
  color: ${white};
  cursor: pointer;
  margin-left: 3.5em;
  align-items: center;
  ${mobile(css`
    display: flex;
  `)}
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
