import React, { useState } from 'react';
import styled from 'styled-components';

import { TableRow, TableColumn, TableColumnBold } from '../../../components/Table';

import { gray100 } from '../../../utils/colors';

import { Address } from '../../../types';

interface Props {
  address: Address
}

const AddressRow = ({ address }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TableRow onClick={() => setIsOpen(!isOpen)}>
      <TableColumnBold>{address.address}</TableColumnBold>
      <TableColumn>{address.bip32derivation[0].path}</TableColumn>
      {isOpen && <TransactionMoreInfo>
        <pre>{JSON.stringify(address, null, 2)}</pre>
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

export default AddressRow;