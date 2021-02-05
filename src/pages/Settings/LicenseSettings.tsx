import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Circle } from "@styled-icons/boxicons-solid";

import {
  Button,
  StyledIcon,
  FileUploader,
  PurchaseLicenseSuccess,
  ErrorModal,
} from "../../components";

import { LilyConfig, LilyLicense, NodeConfig, File } from "../../types";

import { mobile } from "../../utils/media";
import { saveConfig } from "../../utils/files";
import {
  getLicenseUploadErrorMessage,
  licenseExpires,
  isFreeTrial,
  licenseTxId,
  licenseTier,
} from "../../utils/license";

import {
  white,
  green400,
  green700,
  gray200,
  gray400,
  gray500,
  gray900,
  orange400,
  red500,
} from "../../utils/colors";

interface Props {
  config: LilyConfig;
  nodeConfig: NodeConfig;
  openInModal: (component: JSX.Element) => void;
  closeModal: () => void;
  password: string;
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>;
}

const LicenseSettings = ({
  config,
  setConfigFile,
  nodeConfig,
  openInModal,
  password,
}: Props) => {
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
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>License Information</HeaderTitle>
        <HeaderSubtitle>
          This information is private and only seen by you.
        </HeaderSubtitle>
      </HeaderSection>
      <ProfileRow>
        <ProfileKeyColumn>Status</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>
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
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Tier</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>{licenseTier(config.license)}</ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>
          {isFreeTrial(config.license) ? `Trial` : `License`} Expires
        </ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>
            Block {licenseExpires(config.license).toLocaleString()}
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
      <ProfileRow>
        <ProfileKeyColumn>Payment Transaction ID</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>
            {licenseTxId(config.license) || "N/A"}
          </ProfileValueText>
        </ProfileValueColumn>
      </ProfileRow>
      <Buttons>
        <LicenseButtonLabel
          background={white}
          color={gray900}
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

const LicenseButtonLabel = styled.label`
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

const ProfileValueAction = styled.span`
  margin-left: 1rem;
`;

const StatusContainer = styled.span`
  display: flex;
  align-items: center;
`;

export default LicenseSettings;
