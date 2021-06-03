import React from "react";
import styled from "styled-components";
import { Bank } from "@styled-icons/remix-line";
import { Calculator } from "@styled-icons/heroicons-outline";

import { StyledIcon, Button } from "../../components";
import { InnerWrapper } from "./styles";
import { green800, white, gray500, gray800 } from "../../utils/colors";

interface Props {
  header: JSX.Element;
  setSetupOption: React.Dispatch<React.SetStateAction<number>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const SelectAccountScreen = ({ header, setSetupOption, setStep }: Props) => {
  return (
    <InnerWrapper>
      {header}
      <SignupOptionMenu>
        {/* <SignupOptionItem
          background={white}
          color={gray800}
          style={{ borderTop: `8px solid ${green800}` }}
          onClick={() => {
            setSetupOption(2);
            setStep(1);
          }}>
          <StyledIcon as={Wallet} size={48} style={{ marginTop: '0.15em' }} />
          <SignupOptionTextContainer>
            <SignupOptionMainText>Wallet</SignupOptionMainText>
            <SignupOptionSubtext>Create a new Bitcoin wallet with its own mnemonic</SignupOptionSubtext>
          </SignupOptionTextContainer>
        </SignupOptionItem> */}
        <SignupOptionItem
          background={white}
          color={gray800}
          style={{ borderTop: `8px solid ${green800}` }}
          onClick={() => {
            setSetupOption(3);
            setStep(1);
          }}
        >
          <StyledIcon
            as={Calculator}
            size={48}
            style={{ marginTop: "0.15em" }}
          />
          <SignupOptionTextContainer>
            <SignupOptionMainText>Hardware Wallet</SignupOptionMainText>
            <SignupOptionSubtext>
              Import your existing hardware wallet to manage funds in Lily
              similar to Ledger Live or Trezor Wallet
            </SignupOptionSubtext>
          </SignupOptionTextContainer>
        </SignupOptionItem>

        <SignupOptionItem
          background={white}
          color={gray800}
          onClick={() => {
            setSetupOption(1);
            setStep(1);
          }}
        >
          <StyledIcon as={Bank} size={48} style={{ marginTop: "0.15em" }} />
          <SignupOptionTextContainer>
            <SignupOptionMainText>Multisignature Vault</SignupOptionMainText>
            <SignupOptionSubtext>
              Combine multiple hardware wallets to create a vault for securing
              larger amounts of Bitcoin
            </SignupOptionSubtext>
          </SignupOptionTextContainer>
        </SignupOptionItem>
      </SignupOptionMenu>
    </InnerWrapper>
  );
};

const SignupOptionMenu = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 46.875em;
  width: 100%;
`;

const SignupOptionTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 1em;
`;

const SignupOptionMainText = styled.div`
  font-size: 1em;
  line-height: 1.5em;
`;

const SignupOptionSubtext = styled.div`
  font-size: 0.5em;
  color: ${gray800};
  line-height: 1em;
`;

const SignupOptionItem = styled.div`
  ${Button};
  background: ${white};
  border: 1px solid ${gray500};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 4px;
  padding: 1.5em;
  margin: 0.25em 0;
  font-size: 1.5em;
  text-align: center;
  white-space: normal;
`;

export default SelectAccountScreen;
