import React from "react";

import { HeaderWrapper, CancelButton, PageTitleSubtext } from "./styles";
import {
  Header,
  HeaderLeft,
  HeaderRight,
  PageTitle,
  Dropdown,
} from "../../components/";

import { black } from "../../utils/colors";

import { SetStateNumber } from "../../types";

interface Props {
  headerText: string;
  setStep: SetStateNumber;
  step: number;
  setSetupOption: SetStateNumber;
}

const PageHeader = ({ headerText, setStep, step, setSetupOption }: Props) => {
  return (
    <HeaderWrapper>
      <Header>
        <HeaderLeft>
          <PageTitleSubtext>New Account</PageTitleSubtext>
          <PageTitle style={{ color: black, fontWeight: 500 }}>
            {headerText}
          </PageTitle>
        </HeaderLeft>
        <HeaderRight>
          {step === 0 && (
            <Dropdown
              data-cy="Select account dropdown"
              minimal={true}
              dropdownItems={[
                {
                  label: "New Software Wallet",
                  onClick: () => {
                    setSetupOption(2);
                    setStep(1);
                  },
                },
              ]}
            />
          )}
          {step > 0 && (
            <CancelButton
              onClick={() => {
                setStep(0);
              }}
            >
              Cancel
            </CancelButton>
          )}
        </HeaderRight>
      </Header>
    </HeaderWrapper>
  );
};

export default PageHeader;
