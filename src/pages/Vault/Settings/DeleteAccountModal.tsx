import React, { Fragment, useContext, useState } from "react";
import styled, { css } from "styled-components";
import { ExclamationDiamond } from "@styled-icons/bootstrap";
import { useHistory } from "react-router-dom";

import { AccountMapContext } from "../../../AccountMapContext";

import { Input, StyledIcon, Button } from "../../../components";

import { mobile } from "../../../utils/media";
import { white, red100, red500, red600, gray500 } from "../../../utils/colors";
import { saveConfig } from "../../../utils/files";

import { ConfigContext } from "../../../ConfigContext";
interface Props {
  password: string;
}

const DeleteAccountModal = ({ password }: Props) => {
  const { config, setConfigFile } = useContext(ConfigContext);
  const { currentAccount } = useContext(AccountMapContext);
  const [accountNameConfirm, setAccountNameConfirm] = useState("");
  const [accountNameConfirmError, setAccountNameConfirmError] = useState(false);
  const history = useHistory();

  const onInputEnter = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter") {
      removeAccountAndDownloadConfig();
    }
  };

  const removeAccountAndDownloadConfig = () => {
    if (accountNameConfirm === currentAccount.config.name) {
      const configCopy = { ...config };
      if (currentAccount.config.quorum.totalSigners === 1) {
        configCopy.wallets = configCopy.wallets.filter(
          (wallet) => wallet.id !== currentAccount.config.id
        );
      } else {
        configCopy.vaults = configCopy.vaults.filter(
          (vault) => vault.id !== currentAccount.config.id
        );
      }

      saveConfig(configCopy, password);
      setConfigFile({ ...configCopy });
      history.push("/");
    } else {
      setAccountNameConfirmError(true);
    }
  };

  return (
    <Fragment>
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
        <DangerText>Delete Account</DangerText>
        <DangerSubtext>
          You are about to delete an account from your Lily Wallet.
          <br />
          If there are any funds remaining in this account, make sure you have
          your backup.
        </DangerSubtext>
        <Input
          label="Type in the account's name to delete"
          autoFocus
          type="text"
          value={accountNameConfirm}
          onChange={setAccountNameConfirm}
          onKeyDown={(e) => onInputEnter(e)}
          error={accountNameConfirmError}
        />
        {accountNameConfirmError && (
          <ConfirmError>Account name doesn't match</ConfirmError>
        )}

        <DeleteAccountButton
          background={red600}
          color={white}
          onClick={() => {
            removeAccountAndDownloadConfig();
          }}
        >
          Delete Account
        </DeleteAccountButton>
      </DangerTextContainer>
    </Fragment>
  );
};

const DeleteAccountButton = styled.button`
  ${Button}
  margin-top: 1rem;

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

const ConfirmError = styled.div`
  color: ${red500};
`;

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
  font-weight: 600;
`;

const DangerSubtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;

export default DeleteAccountModal;
