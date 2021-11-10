import React from 'react';
import styled from 'styled-components';
import { satoshisToBitcoins } from 'unchained-bitcoin';

import { TableRow, TableColumn } from 'src/components/Table';

import { gray500, gray900, green800 } from 'src/utils/colors';

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
      <UtxoSubheader>Address: {(utxo.address as Address).address}</UtxoSubheader>
    </TableColumnNoPadding>
    <RightAlignColumn>{`${satoshisToBitcoins(utxo.value).toNumber()} BTC`}</RightAlignColumn>
  </TableRowNoBorder>
);

const TableRowNoBorder = styled(TableRow)`
  border-left: none;
  border-right: none;
  border-top: none;
`;

const TableColumnNoPadding = styled(TableColumn)`
  padding-left: 0;
  padding-right: 0;
`;

const UtxoHeader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  font-weight: 500;
`;

const UtxoSubheader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 500;
`;

const RightAlignColumn = styled(TableColumn)`
  text-align: right;
  color: ${green800};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  padding-left: 0;
  padding-right: 0;
`;

export default UtxoRow;
