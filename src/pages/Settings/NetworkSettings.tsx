import React, { useContext } from 'react';
import styled from 'styled-components';
import { Circle } from '@styled-icons/boxicons-solid';

import { ConnectToNodeModal, Dropdown, StyledIcon, SettingsTable } from 'src/components';

import { NodeConfigWithBlockchainInfo } from 'src/types';

import { getNodeStatus } from 'src/utils/other';
import { white, green400, green500, gray700, orange400, red500 } from 'src/utils/colors';
import { PlatformContext } from 'src/context';

interface Props {
  nodeConfig: NodeConfigWithBlockchainInfo;
  getNodeConfig: () => void;
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfigWithBlockchainInfo | undefined>>; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  openInModal: (component: JSX.Element) => void;
  closeModal: () => void;
}

const NetworkSettings = ({
  nodeConfig,
  getNodeConfig,
  setNodeConfig,
  openInModal,
  closeModal
}: Props) => {
  const { platform } = useContext(PlatformContext);

  const refreshNodeData = async () => {
    await getNodeConfig();
  };

  const connectToBlockstream = async () => {
    setNodeConfig(undefined);
    const response = await platform.changeNodeConfig({
      provider: 'Blockstream'
    });
    setNodeConfig(response);
  };

  const connectToElectrum = async () => {
    setNodeConfig(undefined);
    const response = await platform.changeNodeConfig({
      provider: 'Electrum'
    });
    setNodeConfig(response);
  };

  const connectToBitcoinCore = async () => {
    setNodeConfig(undefined);
    try {
      const response = await platform.changeNodeConfig({
        provider: 'Bitcoin Core'
      });
      setNodeConfig(response);
    } catch (e) {
      console.log('e: ', JSON.stringify(e));
      // setNodeConfig(response);
    }
  };

  const nodeConfigDropdownItems = [];

  nodeConfigDropdownItems.push({
    label: 'Connect to Electrum',
    onClick: async () => await connectToElectrum()
  });

  if (nodeConfig && nodeConfig.provider !== 'Bitcoin Core') {
    nodeConfigDropdownItems.push({
      label: 'Connect to Bitcoin Core',
      onClick: async () => await connectToBitcoinCore()
    });
  }
  if (nodeConfig && nodeConfig.provider !== 'Blockstream') {
    nodeConfigDropdownItems.push({
      label: 'Connect to Blockstream',
      onClick: async () => await connectToBlockstream()
    });
  }
  nodeConfigDropdownItems.push({
    label: 'Connect to specific node',
    onClick: () =>
      openInModal(<ConnectToNodeModal setNodeConfig={setNodeConfig} onRequestClose={closeModal} />)
  });

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Network configuration</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          This information is private and only seen by you.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Status</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <StatusContainer>
              {nodeConfig ? (
                <StyledIcon
                  as={Circle}
                  style={{
                    marginRight: '0.35em',
                    color: nodeConfig.initialblockdownload
                      ? orange400
                      : nodeConfig.connected
                      ? green400
                      : red500 // !nodeConfig.connected
                  }}
                />
              ) : (
                <LoadingImage
                  alt='loading placeholder'
                  src={require('../../assets/flower-loading.svg')}
                />
              )}
              {getNodeStatus(nodeConfig)}
            </StatusContainer>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Block Height</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText>
            {nodeConfig && nodeConfig?.blocks > 0
              ? nodeConfig?.blocks?.toLocaleString()
              : nodeConfig?.blocks === 0
              ? ''
              : 'Connecting...'}
          </SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              background={white}
              color={green500}
              onClick={() => refreshNodeData()}
            >
              Refresh
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Data Source</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText>
            {nodeConfig?.baseURL || nodeConfig?.provider}
          </SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <Dropdown
              minimal={false}
              dropdownItems={nodeConfigDropdownItems}
              buttonLabel={
                <SettingsTable.ActionButton
                  style={{ padding: 0 }}
                  background={white}
                  color={green500}
                >
                  Change data source
                </SettingsTable.ActionButton>
              }
            />
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
    </SettingsTable.Wrapper>
  );
};

const StatusContainer = styled.span`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${gray700};
`;

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-right: 0.25em;
  opacity: 0.9;
`;

export default NetworkSettings;
