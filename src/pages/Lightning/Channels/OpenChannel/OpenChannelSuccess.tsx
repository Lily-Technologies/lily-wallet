import React from "react";
import styled from "styled-components";
import { CheckCircle } from "@styled-icons/material";
import { Link } from "react-router-dom";

import { Button, StyledIcon } from "src/components";

import { white, green500, gray700 } from "src/utils/colors";

import { requireLightning } from 'src/hocs';
import { LilyLightningAccount } from "src/types";

interface Props {
  currentAccount: LilyLightningAccount;
}

const OpenChannelSuccess = ({ currentAccount }: Props) => (
  <Wrapper>
    <IconWrapper style={{ color: green500 }}>
      <StyledIcon as={CheckCircle} size={100} />
    </IconWrapper>
    <SuccessText>New channel opened!</SuccessText>
    <SuccessSubtext>
      You just opened a new lightning network channel.
    </SuccessSubtext>
    <SuccessSubtext>
      <ReturnToDashboardButton
        background={green500}
        color={white}
        to={`/lightning/${currentAccount.config.id}`}
      >
        Return to dashboard
      </ReturnToDashboardButton>
    </SuccessSubtext>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${white};
  border-radius: 0.875em;
  padding: 1.5em 0.75em;
`;

const IconWrapper = styled.div``;

const SuccessText = styled.div`
  margin-top: 0.5em;
  font-size: 1.5em;
  color: ${gray700};
`;

const SuccessSubtext = styled.div`
  color: ${gray700};
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ReturnToDashboardButton = styled(Link)`
  ${Button}
  margin-top: 1rem;
`;

export default requireLightning(OpenChannelSuccess);
