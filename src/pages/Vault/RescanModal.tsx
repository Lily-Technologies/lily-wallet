import React, { useState } from "react";
import styled, { css } from "styled-components";
import { PermScanWifi } from "@styled-icons/material-rounded";

import {
  StyledIcon,
  Input,
  Button,
  Spinner,
  ModalContentWrapper,
} from "../../components";

import { mobile } from "../../utils/media";
import {
  white,
  green600,
  red100,
  gray400,
  gray700,
  gray500,
  gray900,
} from "../../utils/colors";

import { LilyAccount } from "../../types";

interface RescanProps {
  startHeight: string;
  currentAccount: LilyAccount;
}

interface Props {
  closeModal: () => void;
  currentAccount: LilyAccount;
  toggleRefresh: () => void;
}

export const RescanModal = ({
  closeModal,
  currentAccount,
  toggleRefresh,
}: Props) => {
  const [startHeight, setStartHeight] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const rescanBlockchain = async ({
    startHeight,
    currentAccount,
  }: RescanProps) => {
    try {
      setIsLoading(true);
      const { success } = await window.ipcRenderer.invoke("/rescanBlockchain", {
        startHeight,
        currentAccount,
      });
      if (success) {
        toggleRefresh();
        closeModal();
      } else {
        setError(
          "Error rescanning. Try again or manually rescanning using bitcoin-cli."
        );
      }
    } catch (e) {
      setError(
        "Error rescanning. Try again or manually rescanning using bitcoin-cli."
      );
    }
    setIsLoading(false);
  };
  return (
    <ModalContentWrapper>
      <DangerIconContainer>
        <StyledIconCircle>
          <StyledIcon style={{ color: gray700 }} as={PermScanWifi} size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <DangerTextContainer>
        <DangerText>Rescan Blockchain</DangerText>
        <DangerSubtext>
          To rescan the blockchain for previous transactions, provide a
          blockheight.
        </DangerSubtext>
        <Input
          label="Rescan from blockheight"
          type="number"
          value={startHeight}
          onChange={setStartHeight}
          error={error}
        />
        <Buttons>
          <ActionButton
            style={{ border: `1px solid ${gray400}`, marginRight: "1em" }}
            color={gray900}
            background={white}
            onClick={() => closeModal()}
          >
            Cancel
          </ActionButton>
          <ActionButton
            onClick={() => rescanBlockchain({ startHeight, currentAccount })}
            color={white}
            background={green600}
          >
            {isLoading ? <Spinner /> : "Rescan Blockchain"}
          </ActionButton>
        </Buttons>
      </DangerTextContainer>
    </ModalContentWrapper>
  );
};

const DangerTextContainer = styled.div`
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
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 1em 0em 0em;
`;

const ActionButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;
