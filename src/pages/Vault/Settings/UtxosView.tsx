import React, { useContext } from "react";

import { AccountMapContext } from "../../../AccountMapContext";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
} from "../../../components/Table";

import UtxoRow from "./UtxoRow";

const UtxosView = () => {
  const { currentAccount } = useContext(AccountMapContext);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentAccount.availableUtxos.map((utxo) => (
          <UtxoRow utxo={utxo} />
        ))}
      </TableBody>
    </Table>
  );
};

export default UtxosView;
