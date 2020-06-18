import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { RestaurantMenu } from '@styled-icons/material';
import { StyledIcon, StyledIconSpinning } from '../../components';

import TransactionRow from './TransactionRow'

import { darkGray, white, blue } from '../../utils/colors';

const shouldDisplayDate = (transactions, index) => {
  if (index === 0) {
    return true;
  } else {
    if (moment.unix(transactions[index].status.block_time).format('MMDDYYYY') !== moment.unix(transactions[index - 1].status.block_time).format('MMDDYYYY')) {
      return true
    }
  }
  return false;
}

const RecentTransactions = ({ transactions, loading, flat = false, maxItems = Infinity }) => {
  return (
    <RecentTransactionsWrapper>
      {!loading && transactions.length > 0 && <RecentTransactionsHeader>Recent Activity</RecentTransactionsHeader>}
      {loading && <LoadingAnimation flat={flat}>
        <StyledIconSpinning as={RestaurantMenu} size={96} />
        <LoadingText>Loading Transactions</LoadingText>
        <LoadingSubText>Please wait...</LoadingSubText>
      </LoadingAnimation>}
      <TransactionsWrapper>
        {transactions.map((transaction, index) => { // eslint-disable-line
          if (index < maxItems) {
            return (
              <TransactionRowWrapper key={index}>
                {shouldDisplayDate(transactions, index) && <DateWrapper>{transaction.status.confirmed ? moment.unix(transaction.status.block_time).format('MMMM DD, YYYY') : 'Waiting for confirmation...'}</DateWrapper>}
                <TransactionRow transaction={transaction} flat={flat} />
              </TransactionRowWrapper>
            )
          }
        })}
        {!loading && transactions.length === 0 && (
          <NoTransasctionsSection flat={flat}>
            <NoTransactionsHeader>No Transactions</NoTransactionsHeader>
            <StyledIcon as={RestaurantMenu} size={96} style={{ color: darkGray }} />
            <NoTransactionsSubtext>No activity has been detected on this account yet.</NoTransactionsSubtext>
          </NoTransasctionsSection>
        )}
      </TransactionsWrapper>
    </RecentTransactionsWrapper>
  )
}

const RecentTransactionsWrapper = styled.div`
  padding: 1.5em;
  margin-top: 1.5em;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TransactionsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TransactionRowWrapper = styled.div`
`;


const DateWrapper = styled.div`
  margin: 24px 4px;
  color: ${darkGray};
`;

const RecentTransactionsHeader = styled.div`
font-size: 1.5em;
`;

const LoadingAnimation = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  box-shadow: background: ${p => p.flat ? 'transparent' : 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'};
  margin: 18px 0;
  flex-direction: column;
  color: ${darkGray};
  padding: 1.5em;
`;

const LoadingText = styled.div`
  font-size: 1.5em;
  margin: 4px 0;
`;

const LoadingSubText = styled.div`
    font-size: .75em;
`;

const NoTransasctionsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  padding: 1.5em;
  background: ${p => p.flat ? 'transparent' : white};
  box-shadow: ${p => p.flat ? 'none' : 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'};
  border: ${p => p.flat ? 'none' : `1px solid ${darkGray}`};
  border-top: ${p => p.flat ? 'none' : `11px solid ${blue}`};
`;

const NoTransactionsHeader = styled.h3`
  color: ${darkGray};
`;
const NoTransactionsSubtext = styled.h4`
  color: ${darkGray};
`;

export default RecentTransactions;