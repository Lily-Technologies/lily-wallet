import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { TransactionRowsLoading, SlideOver } from 'src/components';

import PaymentRow from './PaymentRow';

import { gray600, gray800, white } from 'src/utils/colors';

import { LightningEvent } from '@lily/types';

import LightningDetailsSlideover from './LightningDetailsSlideover';

const shouldDisplayDate = (payments: LightningEvent[], index: number) => {
  let currentItemDate, prevItemDate;
  if (payments[index]?.creationDate) {
    currentItemDate = moment.unix(Number(payments[index]?.creationDate)).format('MMDDYYYY');
  }
  if (payments[index - 1]?.creationDate) {
    prevItemDate = moment.unix(Number(payments[index - 1]?.creationDate)).format('MMDDYYYY');
  }

  if (index === 0) {
    return true;
  } else {
    if (currentItemDate !== prevItemDate) {
      return true;
    }
  }
  return false;
};

interface Props {
  events: LightningEvent[];
  loading: boolean;
  flat: boolean;
}

const RecentTransactions = ({ events, loading, flat = false }: Props) => {
  const [slideoverIsOpen, setSlideoverOpen] = useState(false);
  const [slideoverContent, setSlideoverContent] = useState<JSX.Element | null>(null);

  const openInSlideover = (component: JSX.Element) => {
    setSlideoverOpen(true);
    setSlideoverContent(component);
  };

  return (
    <RecentTransactionsWrapper>
      {(loading || events.length > 0) && (
        <h2 className='flex-1 text-2xl font-bold text-gray-900 mt-12 mb-2 dark:text-white'>
          Recent Activity
        </h2>
      )}
      {loading && <TransactionRowsLoading />}
      <PaymentsWrapper>
        {!loading &&
          events &&
          events.map((event, index) => (
            <PaymentRowWrapper key={index}>
              {shouldDisplayDate(events, index) && (
                <DateWrapper className='text-gray-800 dark:text-gray-200'>
                  {event.creationDate
                    ? moment.unix(Number(event.creationDate)).format('MMMM DD, YYYY')
                    : 'Waiting for confirmation...'}
                </DateWrapper>
              )}
              <PaymentRow
                creation_date={event.creationDate ? Number(event.creationDate) : undefined}
                title={event.title}
                value_sat={Number(event.valueSat)}
                type={event.type}
                onClick={() =>
                  openInSlideover(
                    <LightningDetailsSlideover event={event} setOpen={setSlideoverOpen} />
                  )
                }
              />
            </PaymentRowWrapper>
          ))}
        {!loading && events.length === 0 && (
          <NoPaymentsSection flat={flat}>
            <NoPaymentsHeader>No activity</NoPaymentsHeader>
            <DeadFlower src={require('src/assets/dead-flower.svg')} />
            <NoPaymentsSubtext>
              No activity has been detected on this account yet.
            </NoPaymentsSubtext>
          </NoPaymentsSection>
        )}
      </PaymentsWrapper>
      <SlideOver open={slideoverIsOpen} setOpen={setSlideoverOpen} content={slideoverContent} />
    </RecentTransactionsWrapper>
  );
};

const RecentTransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PaymentsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PaymentRowWrapper = styled.div``;

const DateWrapper = styled.div`
  margin: 1.5em 0 1em;
`;

const NoPaymentsSection = styled.div<{ flat: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  background: ${(p) => (p.flat ? 'transparent' : white)};
  box-shadow: ${(p) =>
    p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);'};
  border-radius: 0.385em;
`;

const NoPaymentsHeader = styled.h3`
  color: ${gray600};
`;
const NoPaymentsSubtext = styled.h4`
  color: ${gray600};
`;

const DeadFlower = styled.img`
  width: 6.25em;
  color: ${gray800};
`;

export default RecentTransactions;
