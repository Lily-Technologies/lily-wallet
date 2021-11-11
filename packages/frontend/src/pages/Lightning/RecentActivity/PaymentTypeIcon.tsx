import React, { Fragment } from 'react';
import styled from 'styled-components';
import {
  VerticalAlignBottom,
  ArrowUpward,
  OpenInFull,
  CloseFullscreen
} from '@styled-icons/material';

import { StyledIcon } from 'src/components';

import { green400, gray500, red500 } from 'src/utils/colors';
import { LightningEvent } from '@lily/types';

interface Props {
  type: LightningEvent['type'];
}

const PaymentTypeIcon = ({ type }: Props) => {
  return (
    <Fragment>
      {type === 'PAYMENT_RECEIVE' && (
        <StyledIconModified as={VerticalAlignBottom} size={48} type={type} />
      )}
      {type === 'PAYMENT_SEND' && <StyledIconModified as={ArrowUpward} size={48} type={type} />}
      {type === 'CHANNEL_OPEN' && <StyledIconModified as={OpenInFull} size={48} type={type} />}
      {type === 'CHANNEL_CLOSE' && (
        <StyledIconModified as={CloseFullscreen} size={48} type={type} />
      )}
    </Fragment>
  );
};

const StyledIconModified = styled(StyledIcon)<{
  type: LightningEvent['type'];
}>`
  padding: 0.5em;
  margin-right: 0.75em;
  background: ${(p) =>
    p.type === 'CHANNEL_OPEN' || p.type === 'CHANNEL_CLOSE'
      ? gray500
      : p.type === 'PAYMENT_SEND'
      ? green400
      : red500};
  border-radius: 50%;
` as any; // TODO: fix

export default PaymentTypeIcon;
