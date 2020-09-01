import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Modal, Input, Spinner } from '../../components';

import { black, darkGray, white, blue, gray, offWhite, gray300, red500 } from '../../utils/colors';

const ConnectToNodeModal = ({
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
      const response = await window.ipcRenderer.invoke('/check-node-connection', {
        nodeConfig: {
          // host: host,
          username: username,
          password: password,
          version: '0.20.0'
        }
      });
      console.log('after uptime: ', response)
      setNodeConfig({
        host: host,
        username: username,
        password: password,
        version: '0.20.0'
      });
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
      </ModalHeader>
      <InputsWrapper>
        <Input label="Host" value={host} onChange={setHost} onKeyDown={(e) => onInputEnter(e)} />
        <Input label="Username" value={username} onChange={setUsername} onKeyDown={(e) => onInputEnter(e)} />
        <Input label="Password" type="password" value={password} onChange={setPassword} onKeyDown={(e) => onInputEnter(e)} />
        {nodeConnectError && <ErrorText>{nodeConnectError}</ErrorText>}
      </InputsWrapper>
    </Modal>
  )
}

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
  margin-left: 1rem;
  margin-top: .5rem;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
`;

const SaveButton = styled.div`
  ${Button};
  margin-left: 1rem;
  margin-top: .5rem;

`;

const InputsWrapper = styled.div`
  padding: 1em 2em 2em;
`;

const ErrorText = styled.div`
  color: ${red500};
`;

export default ConnectToNodeModal;