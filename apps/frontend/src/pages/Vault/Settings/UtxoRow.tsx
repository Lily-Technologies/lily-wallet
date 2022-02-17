import React from 'react';
import styled from 'styled-components';
import { satoshisToBitcoins } from 'unchained-bitcoin';

import { TableRow, TableColumn } from 'src/components/Table';

import { gray500 } from 'src/utils/colors';

import { UTXO, Address } from '@lily/types';
interface Props {
  utxo: UTXO;
}

const UtxoRow = ({ utxo }: Props) => (
  <TableRowNoBorder>
    <TableColumnNoPadding>
      <UtxoHeader>
        {utxo.txid}:{utxo.vout}
      </UtxoHeader>
      <UtxoSubheader className='truncate'>
        Address: {(utxo.address as Address).address}
      </UtxoSubheader>
    </TableColumnNoPadding>
    {/* @ts-ignore */}
    <RightAlignColumn className='text-green-800 dark:text-green-400'>{`${satoshisToBitcoins(
      utxo.value
    ).toNumber()} BTC`}</RightAlignColumn>
  </TableRowNoBorder>
);

const TableRowNoBorder = styled(TableRow)`
  border-left: none;
  border-right: none;
  border-top: none;
  overflow-x: auto;
`;

const TableColumnNoPadding = styled(TableColumn)`
  padding-left: 0;
  padding-right: 0;
`;

const UtxoHeader = styled.div.attrs({
  className: 'text-gray-900 dark:text-gray-300 truncate'
})`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
`;

const UtxoSubheader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 500;
`;

const RightAlignColumn = styled(TableColumn).attrs((props) => ({
  className: props.className
}))`
  text-align: right;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  padding-left: 0;
  padding-right: 0;
`;

export default UtxoRow;
