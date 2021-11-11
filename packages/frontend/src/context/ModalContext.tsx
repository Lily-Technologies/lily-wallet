import React, { createContext, useState } from "react";

export const ModalContext = createContext({
  openInModal: (component: JSX.Element) => {},
  closeModal: () => {},
  modalIsOpen: {} as boolean,
  modalContent: {} as JSX.Element | null,
});

export const ModalProvider = ({ children }: { children: React.ReactChild }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const value = {
    openInModal,
    closeModal,
    modalIsOpen,
    modalContent,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
