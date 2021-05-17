import React, { useState } from "react";
import styled from "styled-components";

import { Button } from "../../components";

import { white, green600, red500, gray500, gray600 } from "../../utils/colors";

import { SetStateString } from "../../types";

interface Props {
  closeModal: () => void;
  importTxFromFile: (file: string) => void;
  importTxFromFileError: string;
  setImportTxFromFileError: SetStateString;
}

const PastePsbtModalContent = ({
  closeModal,
  importTxFromFile,
  importTxFromFileError,
  setImportTxFromFileError,
}: Props) => {
  const [pastedPsbtValue, setPastedPsbtValue] = useState("");

  const onClickCloseModal = () => {
    setPastedPsbtValue("");
    setImportTxFromFileError("");
    closeModal();
  };

  return (
    <>
      <ModalHeaderContainer>
        Paste PSBT or Transaction Hex Below
      </ModalHeaderContainer>
      <div style={{ padding: "1.5em" }}>
        <PastePsbtTextArea
          rows={20}
          onChange={(e) => {
            setPastedPsbtValue(e.target.value);
          }}
        />
        {importTxFromFileError && (
          <ErrorText style={{ paddingBottom: "1em" }}>
            {importTxFromFileError}
          </ErrorText>
        )}
        <ImportButtons>
          <FromFileButton
            style={{ marginRight: "1em" }}
            onClick={() => onClickCloseModal()}
          >
            Cancel
          </FromFileButton>
          <ImportTxButton
            background={green600}
            color={white}
            onClick={() => {
              importTxFromFile(pastedPsbtValue);
            }}
          >
            Import Transaction
          </ImportTxButton>
        </ImportButtons>
      </div>
    </>
  );
};

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const PastePsbtTextArea = styled.textarea`
  width: 100%;
  resize: none;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  margin: 2em 0;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
    border-color: #a4cafe;
  }
`;

const ErrorText = styled.div`
  color: ${red500};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

const ImportButtons = styled.div`
  display: flex;
`;

const FromFileButton = styled.button`
  padding: 1em 1.25rem;
  border: 1px solid ${gray500};
  border-radius: 0.375rem;
  flex: 1;
  text-align: center;
  font-family: "Montserrat", sans-serif;

  &:hover {
    border: 1px solid ${gray600};
    cursor: pointer;
  }
`;

const ImportTxButton = styled.button`
  ${Button};
  flex: 1;
`;

export default PastePsbtModalContent;
