import React, { useContext } from "react";
import styled from "styled-components";

import { AccountMapContext } from "../../../AccountMapContext";

import AddressRow from "./AddressRow";

import { Table, TableBody } from "../../../components/Table";
import { SettingsTable } from "../../../components";

const AddressesView = () => {
  const { currentAccount } = useContext(AccountMapContext);

  return (
    <Padding>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>
          Addresses Information
        </SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          These are the addresses associated with your account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <Table>
        <TableBody>
          {currentAccount.addresses.map((address) => (
            <AddressRow
              key={address.address}
              address={address}
              type="external"
              status="used"
            />
          ))}
          {currentAccount.unusedAddresses.map((address) => (
            <AddressRow
              key={address.address}
              address={address}
              type="external"
              status="unused"
            />
          ))}
          {currentAccount.changeAddresses.map((address) => (
            <AddressRow
              key={address.address}
              address={address}
              type="change"
              status="used"
            />
          ))}
          {currentAccount.unusedChangeAddresses.map((address) => (
            <AddressRow
              key={address.address}
              address={address}
              type="change"
              status="unused"
            />
          ))}
        </TableBody>
      </Table>
    </Padding>
  );
};

const Padding = styled.div`
  padding: 0 1.5em;
`;

export default AddressesView;
