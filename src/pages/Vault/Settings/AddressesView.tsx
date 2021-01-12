import React, { useContext } from 'react';

import { AccountMapContext } from '../../../AccountMapContext';

import AddressRow from './AddressRow';

import { Table, TableHeader, TableHead, TableBody, TableRow } from '../../../components/Table';

const AddressesView = () => {
  const { currentAccount } = useContext(AccountMapContext);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Path</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentAccount.addresses.map((address) => (
          <AddressRow address={address} />
        ))}
        {currentAccount.changeAddresses.map((address) => (
          <AddressRow address={address} />
        ))}
      </TableBody>
    </Table>
  )
}

export default AddressesView;