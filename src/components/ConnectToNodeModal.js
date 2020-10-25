import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Modal, Input, Spinner } from '.';

import { gray300, red500 } from '../utils/colors';

export const ConnectToNodeModal = ({
  isOpen,
  onRequestClose,
  setNodeConfig
}) => {
  const [host, setHost] = useState('http://localhost:8332');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nodeConnectError, setNodeConnectError] = useState(undefined);
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

  const onInputEnter = (e) => {
    if (e.key === 'Enter') {
      configureNode();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalHeader>
        <HeaderText>Input Node Information</HeaderText>
      </ModalHeader>
      <InputsWrapper>
        <InputContainer style={{ marginTop: '1em' }}>
          <Input label="Host" value={host} onChange={setHost} onKeyDown={(e) => onInputEnter(e)} />
        </InputContainer>
        <InputContainer>
          <Input label="Username" value={username} onChange={setUsername} onKeyDown={(e) => onInputEnter(e)} />
        </InputContainer>
        <InputContainer>
          <Input label="Password" type="password" value={password} onChange={setPassword} onKeyDown={(e) => onInputEnter(e)} />
        </InputContainer>
        <SaveButton
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

const SaveButton = styled.div`
  ${Button};
  margin-top: 1.5rem;
`;

const InputsWrapper = styled.div`
  padding: 1em 2em 2em;
`;

const ErrorText = styled.div`
  color: ${red500};
`;