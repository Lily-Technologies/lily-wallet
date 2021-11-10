import React from 'react';

import { SettingsTable } from 'src/components';

import { white, green500 } from 'src/utils/colors';

const About = () => {
  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>About Lily Wallet</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          This information is private and only seen by you.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>

      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Version</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText
            style={{
              textAlign: 'right',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem'
            }}
          >
            {process.env.REACT_APP_VERSION}
          </SettingsTable.ValueText>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Documentation</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              background={white}
              color={green500}
              onClick={() => window.open('https://docs.lily-wallet.com', '_blank')}
            >
              View Documentation
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Terms</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              background={white}
              color={green500}
              onClick={() => window.open('https://lily-wallet.com/terms', '_blank')}
            >
              View Terms
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Privacy</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              background={white}
              color={green500}
              onClick={() => window.open('https://lily-wallet.com/privacy', '_blank')}
            >
              View Privacy Policy
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
    </SettingsTable.Wrapper>
  );
};

export default About;
