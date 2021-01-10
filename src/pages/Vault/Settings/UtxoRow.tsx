import React from "react";
import { satoshisToBitcoins } from "unchained-bitcoin";

import {
  TableRow,
  TableColumn,
  TableColumnBold,
} from "../../../components/Table";

import { UTXO, Address } from "../../../types";
interface Props {
  utxo: UTXO;
}

const UtxoRow = ({ utxo }: Props) => (
  <TableRow>
    <TableColumnBold>{(utxo.address as Address).address}</TableColumnBold>
    <TableColumn>{`${satoshisToBitcoins(
      utxo.value
    ).toNumber()} BTC`}</TableColumn>
  </TableRow>
);

export default UtxoRow;
