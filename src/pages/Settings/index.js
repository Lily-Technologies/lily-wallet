import React from 'react';
import styled from 'styled-components';

import { PageWrapper, PageTitle } from '../../components';

import { black, lightGray, gray, blue, darkGray, white, offWhite } from '../../utils/colors';

const Settings = ({ config }) => {

  return (
    <PageWrapper>
      <PageTitle>Settings</PageTitle>
      <ValueWrapper>

        <SettingsHeadingItem>Devices and Keys</SettingsHeadingItem>
        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsHeader>Connected Keys: </SettingsHeader>
            <SettingsSubheader>
              Here are the keys associated with this account. <br />
                Keys are the building blocks for wallets and vaults. <br />
                Use them individually to receive and send payments or combine them to create vaults.</SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton>Add Another Key</ViewAddressesButton>
          </SettingsSectionRight>
        </SettingsSection>
        <SettingsSection>
          {config.keys.map((key, index) => (
            <DeviceWrapper key={index}>
              <DeviceImage src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
              <DeviceName>{key.model}</DeviceName>
              <DeviceFingerprint>{key.fingerprint}</DeviceFingerprint>
            </DeviceWrapper>
          ))}
        </SettingsSection>

        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsHeader>Encrypted Backups</SettingsHeader>
            <SettingsSubheader>These are the current encrypted backup files in your Google Drive. You can connect other backup providers here.</SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton>Backup Config</ViewAddressesButton>
          </SettingsSectionRight>
        </SettingsSection>

        <SettingsHeadingItem>Developers</SettingsHeadingItem>
        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsHeader>Network: </SettingsHeader>
            <SettingsSubheader>Switch between using the mainnet or testnet network. Testnet coins aren't worth any real money and should only be used by developers</SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton>Change Network</ViewAddressesButton>
          </SettingsSectionRight>
        </SettingsSection>

      </ValueWrapper>
    </PageWrapper>
  )
};


const ValueWrapper = styled.div`
  background: ${white};
  padding: 1.5em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-top: solid 11px ${blue};
`;

const ReceiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border: 1px solid ${lightGray};
`;

const SettingsSection = styled.div`
  display: flex;
  margin: 18px 0;
  justify-content: space-between;
`;

const SettingsSectionLeft = styled.div`

`;

const SettingsSectionRight = styled.div``;


const SettingsHeader = styled.div`
  display: flex;
  font-size: 18px;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${darkGray};
`;


const SettingsSubheader = styled.div`
  display: flex;
  font-size: .9em;
  color: ${darkGray};
  margin: 8px 0;
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${blue};
  padding: 1.5em;
  border-radius: 4px;
`;

const DeviceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: .75em;
  margin: 24px;
  flex: 0 1 250px;
  border-radius: 4px;

  background: none;
  border: none;

  &:hover {
    cursor: pointer;
    background: ${offWhite};
    border: 1px solid ${darkGray};
    padding: 11px;
`;

const DeviceImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-height: 250px;
  max-width: 148px;
`;

const DeviceName = styled.h4`
  text-transform: capitalize;
  margin-bottom: 2px;
  color: ${black};
`;

const DeviceFingerprint = styled.h5`
  color: ${gray};
  margin: 0;
`;

export default Settings