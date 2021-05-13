import React, { useContext, Fragment } from "react";
import styled from "styled-components";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import {
  VerticalAlignBottom,
  ArrowUpward,
  Settings,
  Refresh,
} from "@styled-icons/material";

import { AccountMapContext } from "../../AccountMapContext";

import {
  StyledIcon,
  Button,
  PageTitle,
  Header,
  HeaderRight,
  HeaderLeft,
} from "../../components";

import { white, gray300, green900 } from "../../utils/colors";

interface Props {
  toggleRefresh(): void;
}

const SettingsHeader = ({ toggleRefresh }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const history = useHistory();
  let { url } = useRouteMatch();

  return (
    <Header>
      <HeaderLeft>
        <PageTitle
          style={{ cursor: "pointer" }}
          onClick={() => history.push(url)}
        >
          {currentAccount.name}
        </PageTitle>
        <VaultExplainerText>
          {currentAccount.config.quorum.totalSigners > 1 && (
            <Fragment>
              <IconSvg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </IconSvg>
              {currentAccount.config.quorum.requiredSigners} of{" "}
              {currentAccount.config.quorum.totalSigners} Multisignature Vault
            </Fragment>
          )}
          {currentAccount.config.quorum.totalSigners === 1 &&
            currentAccount.config.mnemonic && (
              <Fragment>
                <IconSvg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                    clipRule="evenodd"
                  ></path>
                </IconSvg>
                <span>Hot Wallet</span>
              </Fragment>
            )}
          {currentAccount.config.quorum.totalSigners === 1 &&
            !currentAccount.config.mnemonic && (
              <Fragment>
                <IconSvg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="calculator w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
                    clipRule="evenodd"
                  ></path>
                </IconSvg>
                <span>Hardware Wallet</span>
              </Fragment>
            )}
        </VaultExplainerText>
      </HeaderLeft>
      <HeaderRight>
        <SendButton to="/send" color={white} background={green900}>
          <StyledIcon
            as={ArrowUpward}
            size={24}
            style={{ marginRight: ".5rem", marginLeft: "-0.25rem" }}
          />
          Send
        </SendButton>
        <ReceiveButton to="/receive" color={white} background={green900}>
          <StyledIcon
            as={VerticalAlignBottom}
            size={24}
            style={{ marginRight: ".5rem", marginLeft: "-0.25rem" }}
          />
          Receive
        </ReceiveButton>
        {!currentAccount.loading && (
          <RefreshButton
            onClick={() => toggleRefresh()}
            color={white}
            background={"transparent"}
          >
            <StyledIcon as={Refresh} size={36} />
          </RefreshButton>
        )}
        {currentAccount.loading && (
          <LoadingImage
            alt="loading placeholder"
            src={require("../../assets/flower-loading.svg")}
          />
        )}
        <SettingsButton
          to={`${url}/settings`}
          color={white}
          background={"transparent"}
          data-cy="settings"
        >
          <StyledIcon as={Settings} size={36} />
        </SettingsButton>
      </HeaderRight>
    </Header>
  );
};

const IconSvg = styled.svg`
  color: ${gray300};
  width: 1.25rem;
  margin-right: 0.375rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 2em;
  margin: 0 0.5em 0 0.75em;
`;

const SendButton = styled(Link)`
  ${Button}
  margin: 12px;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
`;

const ReceiveButton = styled(Link)`
  ${Button}
  margin: 12px;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
`;

const SettingsButton = styled(Link)`
  ${Button}
  border-radius: 25%;
`;

const RefreshButton = styled.button`
  ${Button}
  border-radius: 25%;
  padding-left: 0;
  padding-right: 0;
  margin: 0 0.5em 0 0.75em;
`;

const VaultExplainerText = styled.div`
  color: ${gray300};
  display: flex;
  align-items: center;
  margin-top: 0.5em;
  font-weight: 500;
  font-size: 0.85em;
`;

export default SettingsHeader;
