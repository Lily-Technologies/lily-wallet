import React, { useState } from "react";
import styled from "styled-components";

import { Button, Input } from "../../components";
import {
  InnerWrapper,
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  SetupExplainerText,
  FormContainer,
  BoxedWrapper,
  SetupHeader,
} from "./styles";

import { white, green600 } from "../../utils/colors";
import { capitalize as capitalizeFunc } from "../../utils/other";

interface Props {
  header: JSX.Element;
  setupOption: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  accountName: string;
  setAccountName: React.Dispatch<React.SetStateAction<string>>;
}

const InputNameScreen = ({
  header,
  setupOption,
  setStep,
  accountName,
  setAccountName,
}: Props) => {
  const [nameError, setNameError] = useState("");

  const nextScreenAction = () => {
    if (accountName.length > 3) {
      setStep(2);
    } else {
      setNameError("Not enough characters");
    }
  };

  const onInputEnter = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter") {
      nextScreenAction();
    }
  };

  const getAccountType = (
    setupOption: number,
    capitalize?: "all" | "first" | "none"
  ) => {
    let option;
    if (setupOption === 1) {
      option = "vault";
    } else if (setupOption === 2) {
      option = "wallet";
    } else {
      option = "hardware wallet";
    }

    if (capitalize === "all") {
      const splitOption = option.toLowerCase().split(" ");
      for (var i = 0; i < splitOption.length; i++) {
        splitOption[i] = capitalizeFunc(splitOption[i]);
      }
      // Directly return the joined string
      return splitOption.join(" ");
    } else if (capitalize === "first") {
      return capitalizeFunc(option);
    } else {
      return option;
    }
  };

  return (
    <InnerWrapper>
      {header}
      <FormContainer>
        <BoxedWrapper>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Enter a name</SetupHeader>
                <SetupExplainerText>
                  Give your {getAccountType(setupOption)} a name (i.e. "My First{" "}
                  {getAccountType(setupOption, "all")}") to identify it while
                  using Lily.
                </SetupExplainerText>
              </div>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <PasswordWrapper>
            <Input
              autoFocus
              error={nameError}
              label="Account Name"
              type="text"
              placeholder={`${getAccountType(setupOption, "all")} Name`}
              value={accountName}
              onChange={setAccountName}
              onKeyDown={(e) => onInputEnter(e)}
            />
          </PasswordWrapper>

          <ExportFilesButton
            background={green600}
            color={white}
            // active={accountName.length > 3}
            onClick={() => nextScreenAction()}
          >{`Continue`}</ExportFilesButton>
        </BoxedWrapper>
      </FormContainer>
    </InnerWrapper>
  );
};

const PasswordWrapper = styled.div`
  padding: 1.75em 1.5em;
  display: flex;
  flex-direction: column;
  background: ${white};
`;

const ExportFilesButton = styled.button`
  ${Button};
  padding: 1em;
  font-size: 1em;
  font-weight: 700;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
`;

export default InputNameScreen;
