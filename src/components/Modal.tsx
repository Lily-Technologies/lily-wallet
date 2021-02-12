import React, { useState, useContext } from "react";
import styled from "styled-components";
import ReactModal from "react-modal";
import { Close } from "@styled-icons/ionicons-outline";
import { ModalContext } from "../ModalContext";

import { StyledIcon } from ".";

import { white, gray400, gray600 } from "../utils/colors";

interface Props {
  onAfterOpen?: () => void;
  style?: { content?: any; overlay?: any };
}

export const Modal = ({
  onAfterOpen,
  style = { content: {}, overlay: {} },
}: Props) => {
  const { modalIsOpen, closeModal, modalContent } = useContext(ModalContext);
  const [localOpen, setLocalOpen] = useState(false);

  const afterOpen = () => {
    setLocalOpen(true);
    onAfterOpen && onAfterOpen();
  };

  const requestClose = () => {
    setLocalOpen(false);
    setTimeout(() => {
      closeModal();
    }, 100); // wait for transition to complete
  };

  const styles = {
    content: {
      background: white,
      opacity: 1,
      boxShadow:
        "0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)",
      borderRadius: ".5rem",
      border: "none",
      maxWidth: "50em",
      padding: "0",
      position: "relative",
      width: "100%",
      transform: localOpen ? "scale(1)" : "scale(0.9)",
      transition: "transform 0.25s",
      right: 0,
      left: 0,
      ...style.content,
    },
    overlay: {
      background: localOpen ? "rgba(31, 31, 31, 0.75)" : "rgba(31, 31, 31, 0)",
      transition: "background 0.25s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      ...style.overlay,
    },
  } as ReactModal.Styles;

  return (
    <ReactModal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpen}
      onRequestClose={requestClose}
      style={styles}
      contentLabel="Example Modal"
      htmlOpenClassName="ReactModal__Html--open"
    >
      <ModalContentWrapper>{modalContent}</ModalContentWrapper>
      <CloseButtonContainer>
        <StyledIcon
          onClick={() => requestClose()}
          as={Close}
          size={36}
          style={{ cursor: "pointer" }}
        />
      </CloseButtonContainer>
    </ReactModal>
  );
};

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 1em;
  padding-top: 1em;
  color: ${gray400};

  &:hover {
    color: ${gray600};
  }
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
