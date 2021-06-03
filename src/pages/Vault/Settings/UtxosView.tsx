import React, { useContext } from "react";
import styled from "styled-components";

import { AccountMapContext } from "../../../AccountMapContext";

import { Table, TableBody } from "../../../components/Table";
import { SettingsTable } from "../../../components";

import UtxoRow from "./UtxoRow";

const UtxosView = () => {
  const { currentAccount } = useContext(AccountMapContext);
  return (
    <Padding>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>UTXOs Information</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          These are the unspent transaction outputs (UTXOs) associated with your
          account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
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
