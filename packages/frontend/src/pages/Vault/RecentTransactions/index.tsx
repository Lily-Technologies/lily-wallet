import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Button, SlideOver, TransactionRowsLoading } from 'src/components';

import DeadFlowerImage from 'src/assets/dead-flower.svg';

import TxDetailsModal from './TxDetailsModal';
import TransactionRow from './TransactionRow';

import { gray600, gray800, white, green700 } from 'src/utils/colors';

import { Transaction } from '@lily/types';

const shouldDisplayDate = (transactions: Transaction[], index: number) => {
  if (index === 0) {
    return true;
  } else {
    if (
      moment.unix(transactions[index].status.block_time).format('MMDDYYYY') !==
      moment.unix(transactions[index - 1].status.block_time).format('MMDDYYYY')
    ) {
      return true;
    }
  }
  return false;
};

interface Props {
  transactions: Transaction[];
  loading: boolean;
  flat: boolean;
  openRescanModal?: () => void;
  maxItems?: number;
}

const RecentTransactions = ({
  transactions,
  loading,
  flat = false,
  openRescanModal,
  maxItems = Infinity
}: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  return (
    <RecentTransactionsWrapper>
      {(loading || transactions.length > 0) && (
        <h2 className='flex-1 text-2xl font-bold text-gray-900 mt-12 mb-2 dark:text-white'>
          Recent Activity
        </h2>
      )}
      {loading && <TransactionRowsLoading />}
      <TransactionsWrapper>
        {!loading &&
          transactions.map((transaction, index) => {
            // eslint-disable-line
            if (index < maxItems) {
              return (
                <TransactionRowWrapper key={index}>
                  {shouldDisplayDate(transactions, index) && (
                    <DateWrapper className='text-gray-800 dark:text-gray-200'>
                      {transaction.status.confirmed
                        ? moment.unix(transaction.status.block_time).format('MMMM DD, YYYY')
                        : 'Waiting for confirmation...'}
                    </DateWrapper>
                  )}
                  <TransactionRow
                    onClick={() =>
                      openInModal(
                        <TxDetailsModal transaction={transaction} setOpen={setModalIsOpen} />
                      )
                    }
                    transaction={transaction}
                    flat={flat}
                  />
                </TransactionRowWrapper>
              );
            }
            return null;
          })}
        {!loading && transactions.length === 0 && (
          <div className='h-96 w-full bg-white dark:bg-gray-800 space-y-6 flex flex-col items-center justify-center rounded shadow'>
            <h3 className='text-2xl text-gray-600 dark:text-gray-300 font-medium'>
              No Transactions
            </h3>
            <DeadFlower src={DeadFlowerImage} />
            <p className='text-gray-600 dark:text-gray-400 font-sm font-medium'>
              No activity has been detected on this account yet.
            </p>

            {openRescanModal && (
              <RescanButton background={green700} color={white} onClick={() => openRescanModal()}>
                Scan for Transactions
              </RescanButton>
            )}
          </div>
        )}
      </TransactionsWrapper>
      <SlideOver open={modalIsOpen} setOpen={setModalIsOpen} content={modalContent} />
    </RecentTransactionsWrapper>
  );
};

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

const TransactionRowWrapper = styled.div``;

const DateWrapper = styled.div`
  margin: 1.5em 0 1em;
`;

const DeadFlower = styled.img`
  width: 6.25em;
  color: ${gray800};
`;

const RescanButton = styled.button`
  ${Button}
  margin-top: 0.75em;
`;

export default RecentTransactions;
