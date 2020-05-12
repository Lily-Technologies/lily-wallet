import React from 'react';
import styled from 'styled-components';

import { Button } from '.';
import { black, gray, blue, green, lightBlue, offWhite, darkGray, darkOffWhite } from '../utils/colors';

export const CaravanFileUpload = ({
  caravanFile,
  setCaravanFile,
  step,
  setStep
}) => {
  return (
    <CaravanFileUploadWrapper>
      <CaravanFileUploadHeader>Upload Caravan Import File</CaravanFileUploadHeader>
      <CaravanFileUploadSubheader>Select the caravan import file that was created during initial setup.</CaravanFileUploadSubheader>
      <FileUploadContainer>
        <FileInput
          type="file"
          accept="application/JSON"
          id="caravanFile"
          onChange={(e) => {
            const filereader = new FileReader();

            filereader.onload = (event) => {
              setCaravanFile(JSON.parse(event.target.result));
            };

            filereader.readAsText(e.target.files[0]);
            setStep(step + 1);
          }}
        />
        <CaravanFileUploadLabel htmlFor="caravanFile">{caravanFile ? caravanFile.name : 'Upload File'}</CaravanFileUploadLabel>
      </FileUploadContainer>
      {caravanFile && <NextStepButton onClick={() => setStep(step + 1)}>Next Step</NextStepButton>}
    </CaravanFileUploadWrapper>
  )
}

const CaravanFileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  padding: 1.5em;
  justify-content: center;
  align-items: center;
`;

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


const CaravanFileUploadLabel = styled.label`
  ${Button}
  background: transparent;
  border: 1px solid ${blue};
  color: ${blue};
  pointer: cursor;
  margin-top: 1.5em;
`;

const FileInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`;

const Input = styled.input`
  padding: .75em;
  border-radius: 4px;
  border: 1px solid ${darkOffWhite};
  margin: 8px;
`;

const NextStepButton = styled.button`
  ${Button};
  padding: .75em;
  margin: 0 8px;
`;

const CaravanFileUploadHeader = styled.h5`
  font-size: 1.5em;
  margin: 4px 0;
`;

const CaravanFileUploadSubheader = styled.span`
  font-size: .75em;
`;