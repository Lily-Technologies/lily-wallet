import React, { useContext } from 'react';
import styled from 'styled-components';
import { Circle } from '@styled-icons/boxicons-solid';
import FlowerLoading from 'src/assets/flower-loading.svg';

import {
  ConnectToNodeModal,
  Dropdown,
  StyledIcon,
  SettingsTable,
  DropdownItemProps
} from 'src/components';

import { getNodeStatus } from 'src/utils/other';
import { green400, orange400, red500 } from 'src/utils/colors';
import { PlatformContext } from 'src/context';

import { NodeConfigWithBlockchainInfo } from '@lily/types';

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
    }
  };

  const nodeConfigDropdownItems: DropdownItemProps[] = [];

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
            <StatusContainer className='text-gray-700 dark:text-gray-300'>
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
                <LoadingImage alt='loading placeholder' src={FlowerLoading} />
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
              style={{ marginRight: '1.5em' }}
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
          <SettingsTable.ValueText>{nodeConfig && nodeConfig.provider}</SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <Dropdown
              minimal={false}
              dropdownItems={nodeConfigDropdownItems}
              buttonLabel={
                <SettingsTable.ActionButton style={{ padding: 0 }}>
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
`;

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-right: 0.25em;
  opacity: 0.9;
`;

export default NetworkSettings;
