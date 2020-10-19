import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { RestaurantMenu } from '@styled-icons/material';
import { StyledIcon } from '../../components';

import TransactionRow from './TransactionRow'
import TransactionRowLoading from './TransactionRowLoading'

import { darkGray, white, green800 } from '../../utils/colors';

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
      {(loading || transactions.length > 0) && <RecentTransactionsHeader>Recent Activity</RecentTransactionsHeader>}
      {loading && (<TransactionRowLoading flat={flat} />)}
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
  margin: 1.5em 0 1em;
  color: ${darkGray};
`;

const RecentTransactionsHeader = styled.div`
  font-size: 1.5em;
  margin-top: 1.5em;
`;

const NoTransasctionsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  background: ${p => p.flat ? 'transparent' : white};
  box-shadow: ${p => p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);'};
  border: ${p => p.flat ? 'none' : `1px solid ${darkGray}`};
  border-top: ${p => p.flat ? 'none' : `11px solid ${green800}`};
`;

const NoTransactionsHeader = styled.h3`
  color: ${darkGray};
`;
const NoTransactionsSubtext = styled.h4`
  color: ${darkGray};
`;

export default RecentTransactions;