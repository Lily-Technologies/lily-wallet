import React, { useContext, useState, Fragment } from 'react';
import styled from 'styled-components';
import { Psbt } from 'bitcoinjs-lib';

import PsbtQrCode from './PsbtQrCode';
import DecodePsbtQrCode from './DecodePsbtQrCode';
import TxUtxoDetails from '../../components/TxUtxoDetails';

import { Button } from 'src/components';
import { AccountMapContext } from 'src/context';

import { white, gray900, green600 } from 'src/utils/colors';
import { LilyOnchainAccount } from '@lily/types';

interface Props {
  importSignatureFromFile: (file: string) => void;
  psbt: Psbt;
  closeModal: () => void;
}

const AddSignatureFromQrCode = ({ importSignatureFromFile, psbt, closeModal }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const [step, setStep] = useState(0);

  let screen: JSX.Element | string = 'Ooops, error';
  switch (step) {
    case 0:
      screen = <PsbtQrCode psbt={psbt} />;
      break;
    case 1:
      screen = (
        <TxUtxoDetails
          currentAccount={currentAccount as LilyOnchainAccount}
          psbt={psbt}
          closeModal={closeModal}
        />
      );
      break;
    case 2:
      screen = <DecodePsbtQrCode importSignatureFromFile={importSignatureFromFile} />;
      break;
    default:
      screen = 'Ooops, error';
  }

  return (
    <Fragment>
      {screen}
      <Buttons>
        {step > 0 && (
          <NextButton background={white} color={gray900} onClick={() => setStep(step - 1)}>
            Go Back
          </NextButton>
        )}
        {step < 2 && (
          <NextButton background={green600} color={white} onClick={() => setStep(step + 1)}>
            {step === 0 ? 'Verify Transaction Information' : 'Scan QR from Device to Lily'}
          </NextButton>
        )}
      </Buttons>
    </Fragment>
  );
};

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1.25em 1.5em;
`;

const NextButton = styled.button`
  ${Button};
  margin-left: 1em;
`;

export default AddSignatureFromQrCode;
