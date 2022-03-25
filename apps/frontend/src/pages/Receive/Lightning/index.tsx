import React, { useState } from 'react';

import { requireLightning } from 'src/hocs';

import LightningReceiveQr from './LightningReceiveQr';
import LightningReceiveForm from './LightningReceiveForm';
import LightningReceiveSuccess from './LightningReceiveSuccess';

export const LightningReceive = () => {
  const [step, setStep] = useState(0);
  const [invoice, setInvoice] = useState('');

  let view: JSX.Element;
  if (step === 0) {
    view = <LightningReceiveForm setInvoice={setInvoice} setStep={setStep} />;
  } else if (step === 1) {
    view = <LightningReceiveQr paymentRequest={invoice} setStep={setStep} />;
  } else {
    view = <LightningReceiveSuccess paymentRequest={invoice} />;
  }

  return view;
};

export default requireLightning(LightningReceive);
