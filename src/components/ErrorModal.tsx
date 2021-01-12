import React from 'react';
import styled, { css } from 'styled-components';
import { ExclamationDiamond } from '@styled-icons/bootstrap';

import { StyledIcon } from '.';

import { mobile } from '../utils/media';
import { red100, red600, gray500 } from '../utils/colors';

interface Props {
  message: string
}

export const ErrorModal = ({ message }: Props) => (
  <ModalContentWrapper>
    <DangerIconContainer>
      <StyledIconCircle>
        <StyledIcon style={{ color: red600 }} as={ExclamationDiamond} size={36} />
      </StyledIconCircle>
    </DangerIconContainer>
    <DangerTextContainer>
      <DangerText>Error</DangerText>
      <DangerSubtext>{message}</DangerSubtext>
    </DangerTextContainer>
  </ModalContentWrapper>
)

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5em;
  align-items: flex-start;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};  
`;

const DangerTextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
  `)};
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${red100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DangerText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 600;
`;

const DangerSubtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;