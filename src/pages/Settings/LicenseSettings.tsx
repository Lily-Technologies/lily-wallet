import React, { useContext } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Circle } from "@styled-icons/boxicons-solid";

import {
  Button,
  StyledIcon,
  FileUploader,
  PurchaseLicenseSuccess,
  ErrorModal,
  SettingsTable,
} from "../../components";

import { LilyLicense, NodeConfig, File } from "../../types";

import { saveConfig } from "../../utils/files";
import {
  getLicenseUploadErrorMessage,
  licenseExpires,
  isFreeTrial,
  licenseTxId,
  licenseTier,
} from "../../utils/license";
import { capitalize } from "../../utils/other";

import {
  white,
  green400,
  green700,
  gray400,
  gray800,
  orange400,
  red500,
} from "../../utils/colors";

import { ConfigContext } from "../../ConfigContext";

interface Props {
  nodeConfig: NodeConfig;
  openInModal: (component: JSX.Element) => void;
  closeModal: () => void;
  password: string;
}

const LicenseSettings = ({ nodeConfig, openInModal, password }: Props) => {
  const { config, setConfigFile } = useContext(ConfigContext);
  const history = useHistory();
  const blockDiff = licenseExpires(config.license) - nodeConfig.blocks;
  const blockDiffTimeEst = blockDiff * 10;
  const expireAsDate = moment()
    .add(blockDiffTimeEst, "minutes")
    .format("MMMM Do YYYY, h:mma");

  const onLicenseUpload = (file: File) => {
    const parsedFile = JSON.parse(file.file);
    const licenseErrorMessage = getLicenseUploadErrorMessage(
      parsedFile as LilyLicense,
      nodeConfig
    );
    if (!licenseErrorMessage) {
      const configCopy = { ...config };
      configCopy.license = parsedFile;
      saveConfig(configCopy, password);
      setConfigFile({ ...configCopy });
      openInModal(
        <PurchaseLicenseSuccess config={configCopy} nodeConfig={nodeConfig} />
      );
    } else {
      openInModal(<ErrorModal message={licenseErrorMessage} />);
    }
  };

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>
          License Information
        </SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          This information is private and only seen by you.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Status</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <StatusContainer>
              <StyledIcon
                as={Circle}
                style={{
                  marginRight: "0.35em",
                  color: isFreeTrial(config.license)
                    ? orange400
                    : licenseExpires(config.license) > nodeConfig.blocks
                    ? green400
                    : red500, // config.license.expires > nodeConfig.blocks
                }}
              />
              {isFreeTrial(config.license)
                ? `Free Trial`
                : licenseExpires(config.license) > nodeConfig.blocks
                ? "Active"
                : "Expired"}
            </StatusContainer>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Tier</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            {capitalize(licenseTier(config.license))}
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>
          {isFreeTrial(config.license) ? `Trial` : `License`} Expires
        </SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            Block {licenseExpires(config.license).toLocaleString()}
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>
          Approximate Expire Date
        </SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>{expireAsDate}</SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>
          Payment Transaction ID
        </SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            {licenseTxId(config.license) || "N/A"}
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <Buttons>
        <LicenseButtonLabel
          background={white}
          color={gray800}
          style={{ border: `1px solid ${gray400}`, marginRight: "1em" }}
          htmlFor="licenseUploadButton"
        >
          Import License
        </LicenseButtonLabel>
        <LicenseButton
          background={green700}
          color={white}
          onClick={() => history.push("/purchase")}
        >
          Renew License
        </LicenseButton>
      </Buttons>
      <FileUploader
        accept=".json"
        id="licenseUploadButton"
        onFileLoad={(file: File) => onLicenseUpload(file)}
      />
    </SettingsTable.Wrapper>
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

const LicenseButtonLabel = styled.label`
  ${Button}
`;

const StatusContainer = styled.span`
  display: flex;
  align-items: center;
`;

export default LicenseSettings;
