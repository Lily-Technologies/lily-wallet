import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { Bitcoin } from '@styled-icons/boxicons-logos';
import { AddCircleOutline } from '@styled-icons/material';
import { satoshisToBitcoins } from "unchained-bitcoin";
import moment from 'moment';

import { AccountMapContext } from '../../AccountMapContext';

import { StyledIcon } from '../../components';

import { darkGray, white, gray500, black } from '../../utils/colors';

const getLastTransactionTime = (transactions) => {
  if (transactions.length === 0) { // if no transactions yet
    return `No activity on this account yet`
  } else if (!transactions[0].status.confirmed) { // if last transaction isn't confirmed yet
    return `Last transaction was moments ago`
  } else { // if transaction is confirmed, give moments ago
    return `Last transaction was ${moment.unix(transactions[0].status.block_time).fromNow()}`
  }
}

export const AccountsSection = () => {
  const { accountMap, setCurrentAccountId } = useContext(AccountMapContext);

  return (
    <Fragment>
      <HomeHeadingItem style={{ marginTop: '2.5em', marginBottom: '1em' }}>Your Accounts</HomeHeadingItem>
      <AccountsWrapper>
        {Object.values(accountMap).map((account) => (
          <AccountItem
            to={`/vault/${account.config.id}`}
            onClick={() => setCurrentAccountId(account.config.id)}
            key={account.config.id}>
            <StyledIcon as={Bitcoin} size={48} />
            <AccountInfoContainer>
              <AccountName>{account.name}</AccountName>
              {account.loading && 'Loading...'}
              {!account.loading && <CurrentBalance>Current Balance: {satoshisToBitcoins(account.currentBalance).toFixed(8)} BTC</CurrentBalance>}
              {!account.loading && <CurrentBalance>{getLastTransactionTime(account.transactions)}</CurrentBalance>}
            </AccountInfoContainer>
          </AccountItem>
        ))}
        <AccountItem to={`/setup`}>
          <StyledIcon as={AddCircleOutline} size={48} />
          <AccountInfoContainer>
            <AccountName>Add a new account</AccountName>
            <CurrentBalance>Create a new account to send, receive, and manage bitcoin</CurrentBalance>
          </AccountInfoContainer>
        </AccountItem>
        {!accountMap.size && (
          <InvisibleItem></InvisibleItem>
        )}
      </AccountsWrapper>
    </Fragment>
  )
}

const HomeHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 4em 0 0;
  font-weight: 400;
  color: ${black};
`;

const InvisibleItem = styled.div`
  height: 0;
  width: 0;
`;

const AccountItem = styled(Link)`
  background: ${white};
  padding: 1.5em;
  cursor: pointer;
  color: ${darkGray};
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);

  &:hover {
    color: ${gray500};
  }

  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;

  &:active {
    transform: scale(.99);
    outline: 0;
  }
`;

const AccountInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const AccountsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 1em;
`;

const AccountName = styled.div`
  font-size: 1.25em;
`;

const CurrentBalance = styled.div`
  font-size: 0.65em;
`;