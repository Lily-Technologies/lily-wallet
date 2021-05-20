import React, { useContext } from "react";
import styled from "styled-components";

import { AccountMapContext } from "../../../AccountMapContext";

import { Table, TableBody } from "../../../components/Table";

import UtxoRow from "./UtxoRow";

const UtxosView = () => {
  const { currentAccount } = useContext(AccountMapContext);
  return (
    <Padding>
      <Table>
        <TableBody>
          {currentAccount.availableUtxos.map((utxo) => (
            <UtxoRow key={utxo.txid} utxo={utxo} />
          ))}
        </TableBody>
      </Table>
    </Padding>
  );
};

const Padding = styled.div`
  padding: 0 1.5em;
`;

export default UtxosView;
