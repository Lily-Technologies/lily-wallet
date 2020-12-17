import React, { useState } from 'react';
import styled from 'styled-components';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { TableRow, TableColumn, TableColumnBold } from '../../../components/Table';

import { gray100 } from '../../../utils/colors';

import { UTXO, Address } from '../../../types'
interface Props {
  utxo: UTXO,
}

const UtxoRow = ({ utxo }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TableRow onClick={() => setIsOpen(!isOpen)}>
      <TableColumnBold>{(utxo.address as Address).address}</TableColumnBold>
      <TableColumn>{`${satoshisToBitcoins(utxo.value).toNumber()} BTC`}</TableColumn>
      {isOpen && <TransactionMoreInfo>
        <pre>{JSON.stringify(utxo, null, 2)}</pre>
      </TransactionMoreInfo>}
    </TableRow>
  )
}


const TransactionMoreInfo = styled.div`
  display: flex;
  padding: .75em;
  overflow: scroll;
  background: ${gray100};
`;

export default UtxoRow;