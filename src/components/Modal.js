import React, { useState } from 'react';
import ReactModal from 'react-modal'

import { black, white } from '../utils/colors';

export const Modal = ({ isOpen, onAfterOpen, onRequestClose, style, children }) => {
  const [localOpen, setLocalOpen] = useState(false);

  const afterOpen = () => {
    setLocalOpen(true);
    onAfterOpen && onAfterOpen();
  }

  const requestClose = () => {
    setLocalOpen(false);
    onRequestClose && (
      setTimeout(() => { onRequestClose() }, 100) // wait for transition to complete
    );
  }

  const styles = {
    content: {
      background: white,
      opacity: 1,
      boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)',
      borderRadius: '.5rem',
      border: 'none',
      maxWidth: '50em',
      padding: '0',
      position: 'relative',
      width: '100%',
      transform: localOpen ? 'scale(1)' : 'scale(0.9)',
      transition: 'transform 0.25s',
    },
    overlay: {
      background: localOpen ? 'rgba(31, 31, 31, 0.75)' : 'rgba(31, 31, 31, 0)',
      transition: 'background 0.25s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1000'
    }
  }


  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={afterOpen}
      onRequestClose={requestClose}
      style={styles}
      contentLabel="Example Modal"
    >
      {children}
    </ReactModal>
  )
}