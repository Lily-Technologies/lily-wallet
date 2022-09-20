import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import ReactModal from 'react-modal';
import { Close } from '@styled-icons/ionicons-outline';

import { StyledIcon } from '.';

import { gray400, gray600 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  children: JSX.Element | null;
  onAfterOpen?: () => void;
  style?: { content?: any; overlay?: any };
}

export const Modal = ({
  isOpen,
  closeModal,
  children,
  onAfterOpen,
  style = { content: {}, overlay: {} }
}: Props) => {
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
      opacity: 1,
      boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)',
      borderRadius: '1rem',
      border: 'none',
      maxWidth: '50em',
      padding: '0',
      position: 'relative',
      width: '100%',
      transform: localOpen ? 'scale(1)' : 'scale(0.9)',
      transition: 'transform 0.25s',
      right: 0,
      left: 0,
      overflow: 'hidden',
      ...style.content
    },
    overlay: {
      background: localOpen ? 'rgba(31, 31, 31, 0.75)' : 'rgba(31, 31, 31, 0)',
      transition: 'background 0.25s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      ...style.overlay
    }
  } as ReactModal.Styles;

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={afterOpen}
      onRequestClose={requestClose}
      style={styles}
      contentLabel='Example Modal'
      htmlOpenClassName='ReactModal__Html--open'
      className='bg-white dark:bg-gray-800'
    >
      <StaticModalContentWrapper>{children}</StaticModalContentWrapper>
      <CloseButtonContainer>
        <StyledIcon
          onClick={() => requestClose()}
          as={Close}
          size={36}
          style={{ cursor: 'pointer' }}
        />
      </CloseButtonContainer>
    </ReactModal>
  );
};

const StaticModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
  padding: 1.5em;

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
