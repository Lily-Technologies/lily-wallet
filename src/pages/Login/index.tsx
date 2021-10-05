import React, { useState, Fragment, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { networks, Network } from "bitcoinjs-lib";
import moment from "moment";
import { AES, enc } from "crypto-js";
import { ArrowIosForwardOutline } from "@styled-icons/evaicons-outline";

import { StyledIcon, FileUploader, Button, Input } from "../../components";

import {
  black,
  white,
  gray500,
  gray600,
  gray900,
  green500,
  green600,
} from "../../utils/colors";
import { bitcoinNetworkEqual } from "../../utils/files";
import { mobile } from "../../utils/media";
import { saveConfig } from "../../utils/files";
import {
  updateConfigFileVersionOne,
  updateConfigFileVersionBeta,
  updateConfigFileVersionOneDotFive,
  updateConfigFileVersionOneDotSeven,
} from "../../utils/migration";

import { File } from "../../types";
import { ConfigContext } from "../../ConfigContext";

const MIN_PASSWORD_LENGTH = 8;

interface Props {
  currentBitcoinNetwork: Network;
  encryptedConfigFile: File | null;
  setEncryptedConfigFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  currentBlockHeight: number | undefined;
}

const Login = ({
  currentBitcoinNetwork,
  encryptedConfigFile,
  setEncryptedConfigFile,
  setPassword,
  currentBlockHeight,
}: Props) => {
  const { config, setConfigFile } = useContext(ConfigContext);
  document.title = `Login - Lily Wallet`;
  const [localPassword, setLocalPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [confirmation, setConfirmation] = useState("");
  const [confirmationError, setConfirmationError] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const history = useHistory();

  const unlockFile = () => {
    setIsLoading(true);
    if (encryptedConfigFile) {
      try {
        const bytes = AES.decrypt(encryptedConfigFile.file, localPassword);
        const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
        const migratedConfig = updateConfigFileVersionOneDotSeven(
          updateConfigFileVersionOneDotFive(
            updateConfigFileVersionOne(
              updateConfigFileVersionBeta(decryptedData, currentBlockHeight!)
            )
          )
        );

        setPasswordError(undefined);
        setTimeout(() => {
          setConfigFile(migratedConfig);
          setPassword(localPassword);
          saveConfig(migratedConfig, localPassword); // we resave the file after opening to update the modifiedDate value
          setIsLoading(false);
          history.replace(`/`);
        }, 2000);
      } catch (e) {
        setPasswordError("Incorrect Password");
        setIsLoading(false);
      }
    } else {
      try {
        const configCopy = { ...config };
        configCopy.isEmpty = false;
        setTimeout(() => {
          setConfigFile(configCopy);
          saveConfig(configCopy, localPassword); // we save a blank config file
          setPassword(localPassword);
          setIsLoading(false);
          history.replace(`/`);
        }, 2000);
      } catch (e) {
        setPasswordError("Error. Try again.");
        setIsLoading(false);
      }
    }
  };

  const onClickCreateNew = () => {
    setLocalPassword("");
    setPasswordError(undefined);
    setEncryptedConfigFile(null);
  };

  const onInputEnter = (e: React.KeyboardEvent) => {
    if (encryptedConfigFile && e.key === "Enter") {
      unlockFile();
    }
  };

  const validateInput = () => {
    if (!!localPassword && localPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      );
      return false;
    } else if (!!passwordError) {
      setPasswordError(undefined);
    }

    if (!!localPassword && !!confirmation && localPassword !== confirmation) {
      setConfirmationError("Password doesn't match confirmation");
      return false;
    } else {
      setPasswordError(undefined);
      setConfirmationError(undefined);
      return true;
    }
  };

  return (
    <PageWrapper>
      <Wrapper>
        <MainText>
          {bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ? (
            <LilyLogoGray src={require("../../assets/flower.svg")} />
          ) : (
            <LilyLogo src={require("../../assets/flower.svg")} />
          )}
          <TextContainer>
            <div>
              {encryptedConfigFile
                ? "Unlock your account"
                : "Welcome to Lily Wallet"}
            </div>
            <Subtext>
              {encryptedConfigFile ? (
                <Fragment>
                  or{" "}
                  <SubTextLink onClick={() => onClickCreateNew()}>
                    create a new one
                  </SubTextLink>
                </Fragment>
              ) : (
                "The best way to secure your bitcoin"
              )}
            </Subtext>
          </TextContainer>
        </MainText>

        <FileUploader
          accept=".txt"
          id="localConfigFile"
          onFileLoad={(file: File) => {
            setEncryptedConfigFile(file);
          }}
        />

        <SignupOptionMenu>
          {encryptedConfigFile || step === 1 ? (
            <SignupOptionItem>
              {!encryptedConfigFile && (
                <ExplainerText>
                  Lily encrypts the information about your account on your local
                  machine. This password will be used to decrypt this
                  information when you use Lily in the future.
                </ExplainerText>
              )}
              <InputContainer>
                <Input
                  autoFocus
                  label="Password"
                  value={localPassword}
                  onKeyDown={(e) => onInputEnter(e)}
                  onChange={setLocalPassword}
                  error={passwordError}
                  type="password"
                />
              </InputContainer>
              {!encryptedConfigFile && (
                <InputContainer style={{ paddingBottom: ".5em" }}>
                  <Input
                    label="Confirm Password"
                    value={confirmation}
                    onKeyDown={(e) => onInputEnter(e)}
                    onChange={setConfirmation}
                    error={confirmationError}
                    type="password"
                  />
                </InputContainer>
              )}
              <SignInButton
                background={green500}
                color={white}
                onClick={() => {
                  if (!encryptedConfigFile) {
                    if (validateInput()) {
                      unlockFile();
                    }
                  } else {
                    unlockFile();
                  }
                }}
              >
                {isLoading && !encryptedConfigFile
                  ? "Loading"
                  : isLoading
                    ? "Unlocking"
                    : encryptedConfigFile
                      ? "Unlock"
                      : "Continue"}
                {isLoading ? (
                  <LoadingImage
                    alt="loading placeholder"
                    src={require("../../assets/flower-loading.svg")}
                  />
                ) : (
                  <StyledIcon as={ArrowIosForwardOutline} size={24} />
                )}
              </SignInButton>
              {encryptedConfigFile && (
                <SignupOptionSubtext>
                  Last accessed on{" "}
                  {encryptedConfigFile &&
                    moment(encryptedConfigFile.modifiedTime).format(
                      "MM/DD/YYYY"
                    )}
                </SignupOptionSubtext>
              )}
            </SignupOptionItem>
          ) : (
            <CreateNewAccountButton
              background={green500}
              color={white}
              onClick={() => setStep(1)}
            >
              Get Started
            </CreateNewAccountButton>
          )}

          <LoadFromFile>
            You can also restore a wallet{" "}
            <LabelOverlay htmlFor="localConfigFile">
              <SubTextLink>from a backup file</SubTextLink>
            </LabelOverlay>
          </LoadFromFile>
        </SignupOptionMenu>
      </Wrapper>
      <LilyImageContainer>
        <LilyImage src={require("../../assets/lily-image.jpg")} />
      </LilyImageContainer>
    </PageWrapper>
  );
};

const ExplainerText = styled.span`
  color: ${gray900};
  font-size: 0.75em;
  padding: 0 0 1.5em 0;
  text-align: left;
`;

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-left: 0.25em;
  opacity: 0.9;
`;

const SignInButton = styled.button`
  ${Button};
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  font-size: 1em;
  width: 100%;
  justify-content: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.75em;
  text-align: left;
`;

const SignupOptionSubtext = styled.div`
  font-size: 0.75em;
  margin-top: 1em;
  color: ${gray600};
  padding: 0 2em;
  line-height: 1.5em;
  white-space: normal;
`;

const SignupOptionItem = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 22em;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  background: ${white};
`;

const CreateNewAccountButton = styled.button`
  ${Button};
  width: auto;
  text-align: right;
  align-self: center;
  font-size: 1em;
`;

const LoadFromFile = styled.div`
  color: ${gray500};
  padding-top: 1em;
  font-size: 0.75em;
`;

const PageWrapper = styled.div`
  display: flex;
  min-height: 98vh;
  width: 100%;

  ${mobile(css`
    justify-content: center;
  `)};
`;

const LilyImage = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  object-fit: cover;
  vertical-align: middle;
  width: 100%;
`;

const LilyImageContainer = styled.div`
  position: relative;
  width: 0;
  flex: 1 1 0%;
  display: block;
  ${mobile(css`
    display: none;
  `)};
`;

const Wrapper = styled.div`
  text-align: center;
  font-family: "Montserrat", sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: none;
  flex-direction: column;
  padding-top: 48px;
  padding: 5em;
  justify-content: center;
  position: relative;
`;

const MainText = styled.div`
  display: flex;
  font-size: 2em;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  font-weight: 500;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: center;
  margin-top: 0.5em;
`;

const Subtext = styled.div`
  font-size: 0.5em;
  color: ${gray600};
  font-weight: 500;
  margin-top: 0.5em;
`;

const SubTextLink = styled.span`
  color: ${green600};

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const LilyLogo = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 12px;
`;

const LilyLogoGray = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 12px;
  filter: grayscale(100%);
`;

const LabelOverlay = styled.label`
  width: 100%;
`;

const SignupOptionMenu = styled.div`
  width: 100%;
  padding-top: 1.75em;
  flex-direction: column;
  display: flex;
`;

export default Login;
