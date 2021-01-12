import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Circle } from "@styled-icons/boxicons-solid";

import {
  Button,
  ConnectToNodeModal,
  Dropdown,
  StyledIcon,
} from "../../components";

import { NodeConfig } from "../../types";

import { mobile } from "../../utils/media";
import { getNodeStatus } from "../../utils/other";
import {
  white,
  green400,
  green500,
  gray200,
  gray500,
  gray900,
  orange400,
  red500,
} from "../../utils/colors";

interface Props {
  nodeConfig: NodeConfig;
  getNodeConfig: () => void;
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfig | undefined>>; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  openInModal: (component: JSX.Element) => void;
  closeModal: () => void;
}

const NetworkSettings = ({
  nodeConfig,
  getNodeConfig,
  setNodeConfig,
  openInModal,
  closeModal,
}: Props) => {
  const [nodeConfigDropdownOpen, setNodeConfigDropdownOpen] = useState(false);

  const refreshNodeData = async () => {
    await getNodeConfig();
  };

  const connectToBlockstream = async () => {
    setNodeConfig(undefined);
    const response = await window.ipcRenderer.invoke("/changeNodeConfig", {
      nodeConfig: {
        provider: "Blockstream",
      },
    });
    setNodeConfig(response);
  };

  const connectToBitcoinCore = async () => {
    setNodeConfig(undefined);
    const response = await window.ipcRenderer.invoke("/changeNodeConfig", {
      nodeConfig: {
        provider: "Bitcoin Core",
      },
    });
    setNodeConfig(response);
  };

  const nodeConfigDropdownItems = [];

  if (nodeConfig && nodeConfig.provider !== "Bitcoin Core") {
    nodeConfigDropdownItems.push({
      label: "Connect to Bitcoin Core",
      onClick: async () => await connectToBitcoinCore(),
    });
  }
  if (nodeConfig && nodeConfig.provider !== "Blockstream") {
    nodeConfigDropdownItems.push({
      label: "Connect to Blockstream",
      onClick: async () => await connectToBlockstream(),
    });
  }
  nodeConfigDropdownItems.push({
    label: "Connect to Custom Node",
    onClick: () =>
      openInModal(
        <ConnectToNodeModal
          setNodeConfig={setNodeConfig}
          onRequestClose={closeModal}
        />
      ),
  });

  return (
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>Network Configuration</HeaderTitle>
        <HeaderSubtitle>
          This information is private and only seen by you.
        </HeaderSubtitle>
      </HeaderSection>
      <ProfileRow>
        <ProfileKeyColumn>Status</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>
            <StatusContainer>
              {nodeConfig ? (
                <StyledIcon
                  as={Circle}
                  style={{
                    marginRight: "0.35em",
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
                  src={require("../../assets/flower-loading.svg")}
                />
              )}
              {getNodeStatus(nodeConfig)}
            </StatusContainer>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Block Height</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>
            {nodeConfig
              ? nodeConfig?.blocks?.toLocaleString()
              : "Connecting..."}
          </ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() => refreshNodeData()}
            >
              Refresh
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Data Source</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>{nodeConfig?.provider}</ProfileValueText>
          <ProfileValueAction>
            <Dropdown
              isOpen={nodeConfigDropdownOpen}
              setIsOpen={setNodeConfigDropdownOpen}
              minimal={false}
              dropdownItems={nodeConfigDropdownItems}
              buttonLabel={
                <ActionButton
                  style={{ padding: 0 }}
                  background={white}
                  color={green500}
                >
                  Change Data Source
                </ActionButton>
              }
            />
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
    </GeneralSection>
  );
};

const StatusContainer = styled.span`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
`;

const HeaderSection = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1em;
`;

const HeaderTitle = styled.h3`
  color: ${gray900};
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.5em;
`;

const HeaderSubtitle = styled.span`
  color: ${gray500};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  max-width: 42rem;
`;

const GeneralSection = styled.div`
  padding: 0.5em 1.5em;
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-top: 1px solid ${gray200};

  ${mobile(css`
    display: block;
  `)}
`;

const ProfileKeyColumn = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 600;
  align-items: center;
  display: flex;
`;

const ProfileValueColumn = styled.div`
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
`;

const ProfileValueText = styled.span`
  flex: 1;
`;

const ProfileValueAction = styled.span`
  margin-left: 1rem;
`;

const ActionButton = styled.button`
  ${Button};
  font-weight: 600;
`;

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-right: 0.25em;
  opacity: 0.9;
`;

export default NetworkSettings;
