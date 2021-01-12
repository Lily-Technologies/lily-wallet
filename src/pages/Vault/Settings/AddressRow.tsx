import React from "react";

import {
  TableRow,
  TableColumn,
  TableColumnBold,
} from "../../../components/Table";

import { Address } from "../../../types";

interface Props {
  address: Address;
}

const AddressRow = ({ address }: Props) => (
  <TableRow>
    <TableColumnBold>{address.address}</TableColumnBold>
    <TableColumn>{address.bip32derivation[0].path}</TableColumn>
  </TableRow>
);

export default AddressRow;
