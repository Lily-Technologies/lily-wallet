import React, { Fragment } from 'react';
import styled from 'styled-components';
import { VerticalAlignBottom, ArrowUpward } from '@styled-icons/material';
import { Transfer } from '@styled-icons/boxicons-regular';

import { StyledIcon } from '../../components';

import { green, gray, red500 } from '../../utils/colors';

import { Transaction } from '../../types'

interface Props {
  transaction: Transaction
  flat: boolean
}

const TransactionTypeIcon = ({ transaction, flat }: Props) => {

  return (
    <Fragment>
      { transaction.type === 'received' && <StyledIconModified as={VerticalAlignBottom} size={flat ? 36 : 48} receive={true} />}
      { transaction.type === 'sent' && <StyledIconModified as={ArrowUpward} size={flat ? 36 : 48} />}
      { transaction.type === 'moved' && <StyledIconModified as={Transfer} size={flat ? 36 : 48} moved={true} />}
    </Fragment>
  )
}

const StyledIconModified = styled(StyledIcon) <{ receive?: boolean, moved?: boolean }>`
  padding: .5em;
  margin-right: .75em;
  background: ${p => p.moved ? gray : (p.receive ? green : red500)};
  border-radius: 50%;
`;

export default TransactionTypeIcon;