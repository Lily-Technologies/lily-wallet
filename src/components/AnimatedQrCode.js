import React, { useState } from 'react';
import { QRCode } from "react-qr-svg";

import { white, black } from '../utils/colors';

const getChunks = (value, parts) => {
  const chunkLength = Math.ceil(value.length / parts);
  const result = []
  for (let i = 1; i <= parts; i++) {
    result.push(`${i}/${parts}(:)${value.slice((chunkLength * (i - 1)), (chunkLength * i))}`)
  }
  return result;
}

export const AnimatedQrCode = ({ value }) => {
  console.log('value: ', value);
  const [step, setStep] = useState(0);

  const numChunks = Math.ceil(value.length / 1000);
  const splitValue = getChunks(value, numChunks);
  console.log('splitValue: ', splitValue);

  setTimeout(() => {
    if (step < splitValue.length - 1) {
      setStep(step + 1)
    } else {
      setStep(0);
    }
  }, 500)

  console.log('splitValue[step]: ', splitValue[step]);

  return (
    <QRCode
      bgColor={white}
      fgColor={black}
      level="Q"
      style={{ width: 256 }}
      value={splitValue[step]}
    />
  )
}