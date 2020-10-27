import React from 'react';
import { useHistory } from "react-router-dom";

import { HeaderWrapper, CancelButton, PageTitleSubtext } from './styles';
import { Header, HeaderLeft, HeaderRight, PageTitle } from '../../components/layout';

import { LilyConfig } from '../../types';

interface Props {
  headerText: string
  setStep: React.Dispatch<React.SetStateAction<number>>
  step: number
  config: LilyConfig
}

const PageHeader = ({ headerText, setStep, step, config }: Props) => {
  const history = useHistory();

  return (
    <HeaderWrapper>
      <Header>
        <HeaderLeft>
          <PageTitleSubtext>New Account</PageTitleSubtext>
          <PageTitle>{headerText}</PageTitle>
        </HeaderLeft>
        <HeaderRight>
          {config.isEmpty && <CancelButton onClick={() => { history.push('login') }}>Return to Main Menu</CancelButton>}
          {!config.isEmpty && step > 1 && <CancelButton onClick={() => { setStep(0) }}>Cancel</CancelButton>}
        </HeaderRight>
      </Header>
    </HeaderWrapper>
  )
}

export default PageHeader;