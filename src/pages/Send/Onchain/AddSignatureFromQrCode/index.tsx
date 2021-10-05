import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { Psbt, Network } from "bitcoinjs-lib";

import PsbtQrCode from "./PsbtQrCode";
import DecodePsbtQrCode from "./DecodePsbtQrCode";
import TxUtxoDetails from "../../components/TxUtxoDetails";

import { Button } from "../../../../components";

import { white, gray900, green600 } from "../../../../utils/colors";

interface Props {
  importSignatureFromFile: (file: string) => void;
  psbt: Psbt;
  currentBitcoinPrice: number;
  currentBitcoinNetwork: Network;
}

const AddSignatureFromQrCode = ({
  importSignatureFromFile,
  psbt,
  currentBitcoinPrice,
  currentBitcoinNetwork,
}: Props) => {
  const [step, setStep] = useState(0);

  let screen = null;
  switch (step) {
    case 0:
      screen = <PsbtQrCode psbt={psbt} />;
      break;
    case 1:
      screen = (
        <TxUtxoDetails psbt={psbt} currentBitcoinPrice={currentBitcoinPrice} />
      );
      break;
    case 2:
      screen = (
        <DecodePsbtQrCode importSignatureFromFile={importSignatureFromFile} />
      );
      break;
    default:
      screen = "Ooops, error";
  }

  return (
    <Fragment>
      {screen}
      <Buttons>
        {step > 0 && (
          <NextButton
            background={white}
            color={gray900}
            onClick={() => setStep(step - 1)}
          >
            Go Back
          </NextButton>
        )}
        {step < 2 && (
          <NextButton
            background={green600}
            color={white}
            onClick={() => setStep(step + 1)}
          >
            {step === 0
              ? "Verify Transaction Information"
              : "Scan QR from Device to Lily"}
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
