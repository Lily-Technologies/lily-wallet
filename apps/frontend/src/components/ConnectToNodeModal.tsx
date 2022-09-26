import React, { useState, useContext } from 'react';
import { Switch } from '@headlessui/react';
import styled, { css } from 'styled-components';
import { Connection } from '@styled-icons/icomoon';

import { Button, Input, Spinner, StyledIcon, ModalContentWrapper } from '.';
import { PlatformContext } from 'src/context';

import { mobile } from 'src/utils/media';
import { white, gray500, green600, yellow200, yellow600 } from 'src/utils/colors';
import { classNames } from 'src/utils/other';

import { NodeConfigWithBlockchainInfo } from '@lily/types';

interface Props {
  onRequestClose: () => void;
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfigWithBlockchainInfo | undefined>>; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah?
}

export const ConnectToNodeModal = ({ onRequestClose, setNodeConfig }: Props) => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [useSsl, setUseSsl] = useState(false);
  const [nodeConnectError, setNodeConnectError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { platform } = useContext(PlatformContext);

  const configureNode = async () => {
    try {
      setIsLoading(true);
      const response = await platform.changeNodeConfig({
        provider: 'Electrum',
        host,
        port,
        ssl: useSsl
      });
      setNodeConfig(response);
      onRequestClose();
    } catch (e) {
      setNodeConnectError('Error connecting to node.');
    }
    setIsLoading(false);
  };

  const onInputEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      configureNode();
    }
  };

  return (
    <ModalContentWrapper>
      <IconContainer>
        <StyledIconCircle>
          <StyledIcon style={{ color: yellow600 }} as={Connection} size={36} />
        </StyledIconCircle>
      </IconContainer>
      <ContentContainer>
        <span className='text-xl font-medium text-gray-900 dark:text-gray-100'>
          Connect to a specific endpoint
        </span>
        <ModalSubtext>
          Enter your connection information to get transaction data directly from your node.
        </ModalSubtext>
        <InputsWrapper>
          <InputContainer style={{ marginTop: '1em' }}>
            <Input
              label='Host'
              type='text'
              value={host}
              id='node-host'
              onChange={setHost}
              onKeyDown={(e) => onInputEnter(e)}
              placeholder='electrum1.bluewallet.io'
            />
          </InputContainer>
          <InputContainer>
            <Input
              label='Port'
              type='number'
              id='node-port'
              value={port}
              onChange={setPort}
              onKeyDown={(e) => onInputEnter(e)}
              placeholder='50001'
            />
          </InputContainer>
          <Switch.Group as='div' className='flex items-center'>
            <Switch
              checked={useSsl}
              onChange={setUseSsl}
              className={classNames(
                useSsl ? 'bg-green-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden='true'
                className={classNames(
                  useSsl ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
            <Switch.Label as='span' className='ml-3'>
              <span className='text-sm font-medium text-gray-900 dark:text-slate-100'>Use SSL</span>
            </Switch.Label>
          </Switch.Group>
          <Buttons>
            <SaveButton
              background={green600}
              color={white}
              onClick={async () => {
                await configureNode();
              }}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Connecting...
                </>
              ) : (
                'Connect to node'
              )}
            </SaveButton>
          </Buttons>
        </InputsWrapper>
      </ContentContainer>
    </ModalContentWrapper>
  );
};

const IconContainer = styled.div``;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 1em;
`;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${yellow200};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
  `)};
`;

const SaveButton = styled.button`
  ${Button};
  margin-top: 1.5rem;
`;

const InputsWrapper = styled.div`
  width: 100%;
`;

const ModalSubtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;
