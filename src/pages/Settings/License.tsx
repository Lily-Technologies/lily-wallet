import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import moment from "moment";

import { Button } from "../../components";

import { LilyConfig, NodeConfig } from "../../types";

import { mobile } from "../../utils/media";
import {
  white,
  green700,
  gray200,
  gray400,
  gray500,
  gray900,
} from "../../utils/colors";

interface Props {
  config: LilyConfig;
  nodeConfig: NodeConfig;
}

const LicenseSettings = ({ config, nodeConfig }: Props) => {
  const history = useHistory();
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
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>License Information</HeaderTitle>
        <HeaderSubtitle>
          This information is private and only seen by you.
        </HeaderSubtitle>
      </HeaderSection>
      <ProfileRow>
        <ProfileKeyColumn>Payment Transaction</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>
            {config.license && config.license.txId}
          </ProfileValueText>
          {/* <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() => openInModal(<div>foobar</div>)}
            >Save Backup</ActionButton>
          </ProfileValueAction> */}
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>License Expires</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>
            Block {config.license && config.license.expires.toLocaleString()}
          </ProfileValueText>
          {/* <ProfileValueAction> */}
          {/* </ProfileValueAction> */}
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Approximate Expire Date</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>{expireAsDate}</ProfileValueText>
          {/* <ProfileValueAction> */}
          {/* </ProfileValueAction> */}
        </ProfileValueColumn>
      </ProfileRow>
      <Buttons>
        <LicenseButton
          background={white}
          color={gray900}
          style={{ border: `1px solid ${gray400}`, marginRight: "1em" }}
        >
          Contact Support
        </LicenseButton>
        <LicenseButton
          background={green700}
          color={white}
          onClick={() => history.push("/purchase")}
        >
          Renew License
        </LicenseButton>
      </Buttons>
    </GeneralSection>
  );
};

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
`;

const LicenseButton = styled.button`
  ${Button}
`;

const HeaderSection = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1em;
`;

const HeaderTitle = styled.h3`
  color: ${gray900};
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.5em;
`;

const HeaderSubtitle = styled.span`
  color: ${gray500};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  max-width: 42rem;
`;

const GeneralSection = styled.div`
  padding: 0.5em 1.5em;
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-top: 1px solid ${gray200};

  ${mobile(css`
    display: block;
  `)}
`;

const ProfileKeyColumn = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 600;
  align-items: center;
  display: flex;
`;

const ProfileValueColumn = styled.div`
  grid-column: span 1 / span 1;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ProfileValueText = styled.span`
  flex: 1;
  text-align: right;
`;

export default LicenseSettings;
