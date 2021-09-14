import React from "react";
import styled from "styled-components";
import { Check } from "@styled-icons/material";

import { StyledIcon } from "../../components";

import {
  white,
  gray100,
  gray300,
  gray400,
  gray500,
  gray700,
  green400,
  green500,
} from "../../utils/colors";

interface Props {
  step: number;
  setupOption: number;
}

const Steps = ({ step, setupOption }: Props) => {
  return (
    <StepsGroup>
      <StepItem arrow={true} completed={step > 1} active={step === 1}>
        <StepCircle completed={step > 1} active={step === 1}>
          {step > 1 ? <StyledIcon as={Check} size={25} /> : "01"}
        </StepCircle>
        <StepItemTextContainer>
          <StepItemSubText>
            Give your {setupOption === 2 ? "wallet" : "vault"} a name
          </StepItemSubText>
        </StepItemTextContainer>
      </StepItem>
      <StepItem arrow={true} completed={step > 2} active={step === 2}>
        <StepCircle completed={step > 2} active={step === 2}>
          {step > 2 ? <StyledIcon as={Check} size={25} /> : "02"}
        </StepCircle>
        <StepItemTextContainer>
          {setupOption === 1 && (
            <StepItemSubText>
              Connect or import hardware wallets
            </StepItemSubText>
          )}
          {setupOption === 2 && (
            <StepItemSubText>Write down recovery words</StepItemSubText>
          )}
          {setupOption === 3 && (
            <StepItemSubText>Connect or import hardware wallet</StepItemSubText>
          )}
          {setupOption === 4 && (
            <StepItemSubText>
              Input your node connection information
            </StepItemSubText>
          )}
        </StepItemTextContainer>
      </StepItem>
      <StepItem arrow={false} completed={step > 3} active={step === 3}>
        <StepCircle completed={step > 2} active={step === 3}>
          {step > 2 ? <StyledIcon as={Check} size={25} /> : "03"}
        </StepCircle>
        <StepItemTextContainer>
          <StepItemSubText>Setup Success</StepItemSubText>
        </StepItemTextContainer>
      </StepItem>
    </StepsGroup>
  );
};

const StepItemTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
  justify-content: center;
`;

const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
  border-radius: 9999px;
  border: 1px solid ${(p) => (p.active || p.completed ? green500 : gray400)};
  background: ${(p) => (p.completed ? green400 : "transparent")};
  color: ${(p) => (p.completed ? white : p.active ? green500 : gray500)};
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepsGroup = styled.div`
  display: inline-flex;
  border-radius: 0.375em;
  border: 1px solid ${gray300};
  align-items: stretch;
  margin-bottom: 3.5em;
`;

const StepItem = styled.div<{
  active: boolean;
  completed: boolean;
  arrow: boolean;
}>`
  display: flex;
  align-items: center;
  position: relative;
  // flex-direction: column;
  background: ${(p) => (p.active || p.completed ? white : gray100)};
  color: ${(p) => (p.active ? green500 : p.completed ? gray700 : gray400)};
  padding: 1em 2em 1em 1em;
  border-right: 1px solid rgba(34, 36, 38, 0.15);

  &:after {
    display: ${(p) => (p.arrow ? "auto" : "none")};
    position: absolute;
    z-index: 2;
    content: "";
    top: 50%;
    right: 0;
    border: medium none;
    background-color: ${(p) => (p.active || p.completed ? white : gray100)};
    width: 1.14285714em;
    height: 1.14285714em;
    border-style: solid;
    border-color: ${gray300};
    border-width: 0 1px 1px 0;
    -webkit-transition: background-color 0.1s ease, opacity 0.1s ease,
      color 0.1s ease, -webkit-box-shadow 0.1s ease;
    transition: background-color 0.1s ease, opacity 0.1s ease, color 0.1s ease,
      -webkit-box-shadow 0.1s ease;
    transition: background-color 0.1s ease, opacity 0.1s ease, color 0.1s ease,
      box-shadow 0.1s ease;
    transition: background-color 0.1s ease, opacity 0.1s ease, color 0.1s ease,
      box-shadow 0.1s ease, -webkit-box-shadow 0.1s ease;
    -webkit-transform: translateY(-50%) translateX(50%) rotate(-45deg);
    transform: translateY(-50%) translateX(50%) rotate(-45deg);
  }
`;

const StepItemSubText = styled.div``;

export default Steps;
