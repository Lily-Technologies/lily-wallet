import React, { Fragment } from "react";
import styled from "styled-components";
import { Check } from "@styled-icons/boxicons-regular";
import { Dash } from "@styled-icons/octicons";

import { Button } from ".";

import {
  white,
  gray100,
  gray400,
  gray600,
  gray900,
  green400,
  green700,
} from "../utils/colors";

import { LicenseTiers } from "../types";
interface Props {
  clickRenewLicense: (level: LicenseTiers) => void;
}

export const PricingPlanTable = ({ clickRenewLicense }: Props) => {
  return (
    <Fragment>
      <Table>
        <TableHeader>
          <TableRow>
            <TableColumn></TableColumn>
            <TableColumn>Basic</TableColumn>
            <TableColumn>Essential</TableColumn>
            <TableColumn>Premium</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <BoldTableColumn>Pricing</BoldTableColumn>
            <TableColumn>
              <PriceText>$100</PriceText>
              <PriceSubtext>/year</PriceSubtext>
            </TableColumn>
            <TableColumn>
              <PriceText>$200</PriceText>
              <PriceSubtext>/year</PriceSubtext>
            </TableColumn>
            <TableColumn>
              <PriceText>$500</PriceText>
              <PriceSubtext>/year</PriceSubtext>
            </TableColumn>
          </TableRow>
          <TableRow>
            <PurchaseColumn />
            <PurchaseColumn>
              <PurchaseButton
                onClick={() => clickRenewLicense(LicenseTiers.basic)}
                background={green700}
                color={white}
              >
                Buy Basic
              </PurchaseButton>
            </PurchaseColumn>
            <PurchaseColumn>
              <PurchaseButton
                onClick={() => clickRenewLicense(LicenseTiers.essential)}
                background={green700}
                color={white}
              >
                Buy Essential
              </PurchaseButton>
            </PurchaseColumn>
            <PurchaseColumn>
              <PurchaseButton
                onClick={() => clickRenewLicense(LicenseTiers.premium)}
                background={green700}
                color={white}
              >
                Buy Premium
              </PurchaseButton>
            </PurchaseColumn>
          </TableRow>
          <FeatureRow>
            <BoldTableColumn>Features</BoldTableColumn>
            <TableColumn />
            <TableColumn />
            <TableColumn />
          </FeatureRow>
          <TableRow>
            <TableColumn>Single Signature Hardware Wallets</TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>2-of-3 Multisig Vaults</TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>3-of-5 Multisig Vaults</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <FeatureRow>
            <BoldTableColumn>Support</BoldTableColumn>
            <TableColumn />
            <TableColumn />
            <TableColumn />
          </FeatureRow>
          <TableRow>
            <TableColumn>Email Support</TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>Phone / Zoom Support</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <PurchaseColumn />
            <PurchaseColumn>
              <PurchaseButton
                onClick={() => clickRenewLicense(LicenseTiers.basic)}
                background={green700}
                color={white}
              >
                Buy Basic
              </PurchaseButton>
            </PurchaseColumn>
            <PurchaseColumn>
              <PurchaseButton
                onClick={() => clickRenewLicense(LicenseTiers.essential)}
                background={green700}
                color={white}
              >
                Buy Essential
              </PurchaseButton>
            </PurchaseColumn>
            <PurchaseColumn>
              <PurchaseButton
                onClick={() => clickRenewLicense(LicenseTiers.premium)}
                background={green700}
                color={white}
              >
                Buy Premium
              </PurchaseButton>
            </PurchaseColumn>
          </TableRow>
        </TableBody>
      </Table>
    </Fragment>
  );
};

const PurchaseButton = styled.button`
  ${Button};
`;

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  height: 1px;
  border: none;
  background: ${white};
  border-collapse: collapse;
`;

const TableHeader = styled.thead``;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border: 1px solid ${gray100};
`;

const FeatureRow = styled(TableRow)`
  background: ${gray100};
  line-height: 0.25em;
`;

const TableColumn = styled.td`
  border: none;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-bottom: 1px solid ${gray400};
  border-width: thin;
`;

const PurchaseColumn = styled(TableColumn)`
  border: none;
`;

const BoldTableColumn = styled(TableColumn)`
  font-weight: 900;
`;

const CheckMark = styled(Check)`
  width: 1.5em;
  color: ${green400};
`;

const DashIcon = styled(Dash)`
  width: 1.5em;
  color: ${gray400};
`;

const PriceText = styled.span`
  color: ${gray900};
  font-weight: 800;
  font-size: 2.25rem;
  line-height: 2.5rem;
}
`;

const PriceSubtext = styled.span`
  color: ${gray600};
  line-height: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
`;
