import React from 'react';
import styled from 'styled-components';
import { Check } from '@styled-icons/material';

import { StyledIcon } from '../../components';

import { black, gray, blue, white, darkGreen, offWhite, darkGray, darkOffWhite, lightBlue, gray100, gray200, gray300, gray400, gray500, gray700, blue100, blue300, blue400, blue500, blue600 } from '../../utils/colors';

const Steps = ({ step }) => {
  return (
    <StepsGroup>
      <StepItem arrow={true} completed={step > 1} active={step === 1}>
        <StepCircle completed={step > 1}>
          {step > 1 ? <StyledIcon as={Check} size={25} /> : '01'}
        </StepCircle>
        <StepItemTextContainer>
          <StepItemMainText>Step 1</StepItemMainText>
          <StepItemSubText>Give your vault a name</StepItemSubText>
        </StepItemTextContainer>
      </StepItem>
      <StepItem arrow={true} completed={step > 2} active={step === 2}>
        <StepCircle completed={step > 2}>
          {step > 2 ? <StyledIcon as={Check} size={25} /> : '02'}
        </StepCircle>
        <StepItemTextContainer>
          <StepItemMainText>Step 2</StepItemMainText>
          <StepItemSubText>Connect devices associated with vault</StepItemSubText>
        </StepItemTextContainer>
      </StepItem>
      <StepItem arrow={false} completed={step > 3} active={step === 3}>
        <StepCircle completed={step > 3}>
          {step > 3 ? <StyledIcon as={Check} size={25} /> : '03'}
        </StepCircle>
        <StepItemTextContainer>
          <StepItemMainText>Step 3</StepItemMainText>
          <StepItemSubText>Encrypt your configuration file</StepItemSubText>
        </StepItemTextContainer>
      </StepItem>
    </StepsGroup>
  )
}

const StepItemTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
  justify-content: center;
`;

const StepCircle = styled.div`
  border-radius: 9999px;
  border: 1px solid ${p => p.completed ? blue500 : gray400};
  background: ${p => p.completed ? blue400 : 'transparent'};
  color: ${p => p.completed ? white : gray500};
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
  margin-bottom: 3em;
`;


const StepItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  // flex-direction: column;
  background: ${p => (p.active || p.completed) ? white : gray100};
  color: ${p => (p.active || p.completed) ? gray700 : gray400};
  padding: 1em 2em 1em 1em;
  border-bottom: 4px solid ${p => p.active ? blue500 : 'none'};

  border-right: 1px solid rgba(34,36,38,.15);

  &:after { 
    display: ${p => p.arrow ? 'auto' : 'none'};
    position: absolute;
    z-index: 2;
    content: '';
    top: 50%;
    right: 0;
    border: medium none;
    background-color: ${p => (p.active || p.completed) ? white : gray100};
    width: 1.14285714em;
    height: 1.14285714em;
    border-style: solid;
    border-color: ${gray300};
    border-width: 0 1px 1px 0;
    -webkit-transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;
    transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;
    transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease;
    transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease,-webkit-box-shadow .1s ease;
    -webkit-transform: translateY(-50%) translateX(50%) rotate(-45deg);
    transform: translateY(-50%) translateX(50%) rotate(-45deg);
  }
`;
const StepItemMainText = styled.div``;
const StepItemSubText = styled.div``;

export default Steps;