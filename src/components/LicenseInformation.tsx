import React from "react";
import styled from "styled-components";
import moment from "moment";

import { gray500, gray900 } from "../utils/colors";
import { licenseExpires, licenseTxId, licenseTier } from "../utils/license";
import { capitalize } from "../utils/other";

import { NodeConfig, VaultConfig } from "../types";

interface Props {
  config: VaultConfig;
  nodeConfig: NodeConfig;
}

export const LicenseInformation = ({ config, nodeConfig }: Props) => {
  const blockDiff = licenseExpires(config.license) - nodeConfig.blocks;
  const blockDiffTimeEst = blockDiff * 10;
  const expireAsDate = moment()
    .add(blockDiffTimeEst, "minutes")
    .format("MMMM Do YYYY, h:mma");

  return (
    <Wrapper>
      <ItemContainer>
        <ItemLabel>License Tier</ItemLabel>
        <ItemValue>{capitalize(licenseTier(config.license))}</ItemValue>
      </ItemContainer>
      <ItemContainer>
        <ItemLabel>License Expires</ItemLabel>
        <ItemValue>
          Block {licenseExpires(config.license).toLocaleString()}
        </ItemValue>
      </ItemContainer>
      <ItemContainer>
        <ItemLabel>Approximate Expire Date</ItemLabel>
        <ItemValue>{expireAsDate}</ItemValue>
      </ItemContainer>
      <ItemContainer>
        <ItemLabel>Payment Transaction</ItemLabel>
        <ItemValue>{licenseTxId(config.license)}</ItemValue>
      </ItemContainer>
    </Wrapper>
  );
};

const ItemContainer = styled.div`
  margin: 1em 0;
`;

const ItemLabel = styled.div`
  color: ${gray500};
  font-weight: 900;
`;

const ItemValue = styled.div`
  color: ${gray900};
`;

const Wrapper = styled.div`
  padding: 1em 2em 2em;
`;
