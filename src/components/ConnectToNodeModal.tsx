import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

import { Button, Modal, Input, Spinner } from '.';

import { white, green600, gray300, red500 } from '../utils/colors';

import { NodeConfig } from '../types'

interface Props {
  isOpen: boolean
  onRequestClose: () => void
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfig | undefined>> // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah?
}

export const ConnectToNodeModal = ({
  isOpen,
  onRequestClose,
  setNodeConfig
}: Props) => {
  const [host, setHost] = useState('http://localhost:8332');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nodeConnectError, setNodeConnectError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const configureNode = async () => {
    try {
      setIsLoading(true)
      const response = await window.ipcRenderer.invoke('/changeNodeConfig', {
        nodeConfig: {
          host: host,
          username: username,
          password: password,
          version: '0.20.1'
        }
      });

      setNodeConfig(response);
      onRequestClose();
    } catch (e) {
      setNodeConnectError('Error Connecting to Node.')
    }
    setIsLoading(false)
  }

  const onInputEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      configureNode();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Fragment>
        <ModalHeader>
          <HeaderText>Input Node Information</HeaderText>
        </ModalHeader>
        <InputsWrapper>
          <InputContainer style={{ marginTop: '1em' }}>
            <Input
              label="Host"
              type="text"
              value={host}
              onChange={setHost}
              onKeyDown={(e) => onInputEnter(e)} />
          </InputContainer>
          <InputContainer>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              onKeyDown={(e) => onInputEnter(e)} />
          </InputContainer>
          <InputContainer>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              onKeyDown={(e) => onInputEnter(e)} />
          </InputContainer>
          <SaveButton
            background={green600}
            color={white}
            onClick={async () => {
              try {
                await configureNode()
              } catch (e) {
                console.log('e: ', e);
                setNodeConnectError('Error Connecting to Node.')
                setIsLoading(false);
              }
            }}>
            {isLoading ? <Spinner /> : 'Connect to Node'}
          </SaveButton>
          {nodeConnectError && <ErrorText>{nodeConnectError}</ErrorText>}
        </InputsWrapper>
      </Fragment>
    </Modal>
  )
}

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 1em;
`;

const ModalHeader = styled.div`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-top: -.5rem;
  justify-content: space-between;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${gray300};
`;

const HeaderText = styled.div`
  margin-top: .5rem;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
`;

const SaveButton = styled.button`
  ${Button};
  margin-top: 1.5rem;
`;

const InputsWrapper = styled.div`
  padding: 1em 2em 2em;
`;

const ErrorText = styled.div`
  color: ${red500};
`;