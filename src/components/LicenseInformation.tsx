import React from "react";
import styled from "styled-components";
import moment from "moment";

import { gray500, gray900 } from "../utils/colors";

import { LilyConfig, NodeConfig } from "../types";

interface Props {
  config: LilyConfig;
  nodeConfig: NodeConfig;
}

export const LicenseInformation = ({ config, nodeConfig }: Props) => {
  let blockDiff;
  if (nodeConfig) {
    blockDiff = config.license.expires - nodeConfig.blocks;
  } else {
    blockDiff = config.license.expires;
  }
  const blockDiffTimeEst = blockDiff * 10;
  const expireAsDate = moment()
    .add(blockDiffTimeEst, "minutes")
    .format("MMMM Do YYYY, h:mma");

  return (
    <Wrapper>
      <ItemContainer>
        <ItemLabel>Payment Transaction</ItemLabel>
        <ItemValue>{config.license && config.license.txId}</ItemValue>
      </ItemContainer>

      <ItemContainer>
        <ItemLabel>License Expires</ItemLabel>
        <ItemValue>
          Block {config?.license?.expires?.toLocaleString()}
        </ItemValue>
      </ItemContainer>

      <ItemContainer>
        <ItemLabel>Approximate Expire Date</ItemLabel>
        <ItemValue>{expireAsDate}</ItemValue>
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
