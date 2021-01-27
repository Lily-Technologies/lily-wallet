import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Connection } from "@styled-icons/icomoon";

import { Button, Input, Spinner, StyledIcon } from ".";

import { mobile } from "../utils/media";
import {
  white,
  gray500,
  green600,
  yellow100,
  yellow400,
  red500,
} from "../utils/colors";

import { NodeConfig } from "../types";

interface Props {
  onRequestClose: () => void;
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfig | undefined>>; // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah?
}

export const ConnectToNodeModal = ({
  onRequestClose,
  setNodeConfig,
}: Props) => {
  const [host, setHost] = useState("mynode.local");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nodeConnectError, setNodeConnectError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const configureNode = async () => {
    try {
      setIsLoading(true);
      const response = await window.ipcRenderer.invoke("/changeNodeConfig", {
        nodeConfig: {
          baseURL: host,
          auth: {
            username,
            password,
          },
        },
      });
      setNodeConfig(response);
      onRequestClose();
    } catch (e) {
      setNodeConnectError("Error connecting to node.");
    }
    setIsLoading(false);
  };

  const onInputEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      configureNode();
    }
  };

  return (
    <ModalContentWrapper>
      <IconContainer>
        <StyledIconCircle>
          <StyledIcon style={{ color: yellow400 }} as={Connection} size={36} />
        </StyledIconCircle>
      </IconContainer>
      <ContentContainer>
        <DangerText>Connect to a specific node</DangerText>
        <DangerSubtext>
          Enter your node information to get transaction data directly from your
          node.
        </DangerSubtext>
        <InputsWrapper>
          <InputContainer style={{ marginTop: "1em" }}>
            <Input
              label="Host"
              type="text"
              value={host}
              onChange={setHost}
              onKeyDown={(e) => onInputEnter(e)}
            />
          </InputContainer>
          <InputContainer>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              onKeyDown={(e) => onInputEnter(e)}
            />
          </InputContainer>
          <InputContainer>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              onKeyDown={(e) => onInputEnter(e)}
            />
          </InputContainer>
          {nodeConnectError && <ErrorText>{nodeConnectError}</ErrorText>}
          <Buttons>
            <SaveButton
              background={green600}
              color={white}
              onClick={async () => {
                await configureNode();
              }}
            >
              {isLoading ? <Spinner /> : "Connect to Node"}
            </SaveButton>
          </Buttons>
        </InputsWrapper>
      </ContentContainer>
    </ModalContentWrapper>
  );
};

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5em;
  align-items: flex-start;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};
`;

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
  background: ${yellow100};
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

const ErrorText = styled.div`
  color: ${red500};
`;

const DangerText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 600;
`;

const DangerSubtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;
