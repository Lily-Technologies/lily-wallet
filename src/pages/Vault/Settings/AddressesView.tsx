import React from "react";
import styled from "styled-components";

import AddressRow from "./AddressRow";

import { requireOnchain } from "../../../hocs";

import { Table, TableBody } from "../../../components/Table";
import { SettingsTable } from "../../../components";
import { LilyOnchainAccount } from "src/types";

interface Props {
  currentAccount: LilyOnchainAccount;
}

const AddressesView = ({ currentAccount }: Props) => {
  const { addresses, unusedAddresses, changeAddresses, unusedChangeAddresses } = currentAccount;

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
          {addresses.map((address) => (
            <AddressRow
              key={address.address}
              address={address}
              type="external"
              status="used"
            />
          ))}
          {unusedAddresses.map((address) => (
            <AddressRow
              key={address.address}
              address={address}
              type="external"
              status="unused"
            />
          ))}
          {changeAddresses.map((address) => (
            <AddressRow
              key={address.address}
              address={address}
              type="change"
              status="used"
            />
          ))}
          {unusedChangeAddresses.map((address) => (
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

export default requireOnchain(AddressesView);
