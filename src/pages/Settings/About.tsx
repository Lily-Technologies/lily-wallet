import React from "react";
import styled, { css } from "styled-components";

import { Button } from "../../components";

import { LilyConfig } from "../../types";

import { mobile } from "../../utils/media";
import { white, green500, gray200, gray500, gray900 } from "../../utils/colors";

interface Props {
  config: LilyConfig;
}

const About = ({ config }: Props) => {
  return (
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>About Lily Wallet</HeaderTitle>
        <HeaderSubtitle>
          This information is private and only seen by you.
        </HeaderSubtitle>
      </HeaderSection>

      <ProfileRow>
        <ProfileKeyColumn>Version</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText
            style={{
              textAlign: "right",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
            }}
          >
            {config.version}
          </ProfileValueText>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Documentation</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() =>
                window.open("https://docs.lily.kevinmulcrone.com", "_blank")
              }
            >
              View Documentation
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Terms</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() =>
                window.open("https://lily.kevinmulcrone.com/terms", "_blank")
              }
            >
              View Terms
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Privacy</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() =>
                window.open("https://lily.kevinmulcrone.com/privacy", "_blank")
              }
            >
              View Privacy Policy
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
    </GeneralSection>
  );
};

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
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
`;

const ProfileValueText = styled.span`
  flex: 1;
`;

const ProfileValueAction = styled.span`
  margin-left: 1rem;
`;

const ActionButton = styled.button`
  ${Button};
  font-weight: 600;
`;

export default About;
