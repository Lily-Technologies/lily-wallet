import React, { useContext, useState } from "react";
import styled, { css } from "styled-components";
import { EditAlt } from "@styled-icons/boxicons-regular";

import { AccountMapContext } from "../../../AccountMapContext";

import {
  Input,
  StyledIcon,
  Button,
  ModalContentWrapper,
} from "../../../components";

import { mobile } from "../../../utils/media";
import {
  white,
  green100,
  green600,
  gray300,
  gray500,
  gray700,
} from "../../../utils/colors";
import { saveConfig } from "../../../utils/files";

import { ConfigContext } from "../../../ConfigContext";
import { VaultConfig } from "types";

interface Props {
  password: string;
  closeModal: () => void;
}

const EditAccountNameModal = ({ password, closeModal }: Props) => {
  const { config, setConfigFile } = useContext(ConfigContext);
  const { currentAccount } = useContext(AccountMapContext);
  const [accountNameConfirm, setAccountNameConfirm] = useState("");
  const [accountNameConfirmError, setAccountNameConfirmError] = useState("");

  const onInputEnter = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter") {
      editNameAndUpdateConfig();
    }
  };

  const editNameAndUpdateConfig = () => {
    try {
      if (accountNameConfirm === "") {
        throw Error("Invalid account name");
      }
      const currentAccountConfigCopy = { ...currentAccount.config };
      currentAccountConfigCopy.name = accountNameConfirm;
      const configCopy = { ...config };
      if (currentAccount.config.quorum.totalSigners === 1) {
        configCopy.wallets = configCopy.wallets.filter(
          (wallet) => wallet.id !== currentAccount.config.id
        );
        configCopy.wallets.push(currentAccountConfigCopy);
      } else {
        configCopy.vaults = configCopy.vaults.filter(
          (vault) => vault.id !== currentAccount.config.id
        );
        configCopy.vaults.push(currentAccountConfigCopy as VaultConfig);
      }

      saveConfig(configCopy, password);
      setConfigFile({ ...configCopy });
      closeModal();
    } catch (e) {
      setAccountNameConfirmError(e.message);
    }
  };

  return (
    <ModalContentWrapper>
      <DangerIconContainer>
        <StyledIconCircle>
          <StyledIcon style={{ color: green600 }} as={EditAlt} size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <TextContainer>
        <HeadingText>Edit Account Name</HeadingText>
        <Subtext>
          This information is private and only viewable within the Lily App.
        </Subtext>
        <Input
          label="Account Name"
          autoFocus
          type="text"
          value={accountNameConfirm}
          onChange={setAccountNameConfirm}
          onKeyDown={(e) => onInputEnter(e)}
          error={accountNameConfirmError}
        />
        <Buttons>
          <CancelButton
            background={white}
            color={gray700}
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </CancelButton>
          <SaveChangesButton
            background={green600}
            color={white}
            onClick={() => {
              editNameAndUpdateConfig();
            }}
          >
            Save
          </SaveChangesButton>
        </Buttons>
      </TextContainer>
    </ModalContentWrapper>
  );
};

const Buttons = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${mobile(css`
    flex-direction: column;
  `)};
`;

const SaveChangesButton = styled.button`
  ${Button}
  margin-top: 1rem;

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

const CancelButton = styled.button`
  ${Button}
  margin-top: 1rem;
  border: 1px solid ${gray300};

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

const TextContainer = styled.div`
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
  background: ${green100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeadingText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

const Subtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;

export default EditAccountNameModal;
