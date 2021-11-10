import React, { useState } from 'react';
import { QRCode } from 'react-qr-svg';

import { white, black } from 'src/utils/colors';

interface Props {
  valueArray: string[];
}

export const AnimatedQrCode = ({ valueArray }: Props) => {
  const [step, setStep] = useState(0);

  setTimeout(() => {
    if (step < valueArray.length - 1) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  }, 500);

  return (
    <QRCode
      bgColor={white}
      fgColor={black}
      level='Q'
      style={{ width: 256 }}
      value={valueArray[step]}
    />
  );
};
