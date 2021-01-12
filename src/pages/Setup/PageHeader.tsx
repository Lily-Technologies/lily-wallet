import React, { useState } from 'react';

import { HeaderWrapper, CancelButton, PageTitleSubtext } from './styles';
import { Header, HeaderLeft, HeaderRight, PageTitle, Dropdown } from '../../components/';

import { black } from '../../utils/colors';

import { SetStateNumber } from '../../types';

interface Props {
  headerText: string
  setStep: SetStateNumber
  step: number
  setSetupOption: SetStateNumber
}

const PageHeader = ({ headerText, setStep, step, setSetupOption }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <HeaderWrapper>
      <Header>
        <HeaderLeft>
          <PageTitleSubtext>New Account</PageTitleSubtext>
          <PageTitle style={{ color: black }}>{headerText}</PageTitle>
        </HeaderLeft>
        <HeaderRight>
          {step === 0 && <Dropdown
            isOpen={dropdownOpen}
            setIsOpen={setDropdownOpen}
            minimal={true}
            dropdownItems={[
              { label: 'New Software Wallet', onClick: () => { setSetupOption(2); setStep(1) } },
            ]}
          />}
          {step > 0 && <CancelButton onClick={() => { setStep(0) }}>Cancel</CancelButton>}
        </HeaderRight>
      </Header>
    </HeaderWrapper>
  )
}

export default PageHeader;