import React from "react";
import styled from "styled-components";
import { ExclamationDiamond } from "@styled-icons/bootstrap";

import { StyledIcon, ModalContentWrapper, Button } from ".";

import { white, red100, red600, gray500 } from "../utils/colors";

interface Props {
  message: string;
}

export const ErrorModal = ({ message }: Props) => (
  <ModifiedModalContentWrapper>
    <DangerIconContainer>
      <StyledIconCircle>
        <StyledIcon
          style={{ color: red600 }}
          as={ExclamationDiamond}
          size={36}
        />
      </StyledIconCircle>
    </DangerIconContainer>
    <DangerTextContainer>
      <DangerText>Error</DangerText>
      <DangerSubtext>{message}</DangerSubtext>
      <DismissButton color={white} background={red600}>
        Dismiss
      </DismissButton>
    </DangerTextContainer>
  </ModifiedModalContentWrapper>
);

const DismissButton = styled.button`
  ${Button}
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 100%;
  margin-top: 1.25rem;
`;

const ModifiedModalContentWrapper = styled(ModalContentWrapper)`
  flex-direction: column;
  align-items: center;
  margin-top: 1.25rem;
  max-width: ;
`;

const DangerTextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  margin-top: 0.75rem;
  width: 100%;
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${red100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DangerText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

const DangerSubtext = styled.div`
  margin-top: 0.5rem;
  color: ${gray500};
  text-align: center;
`;
