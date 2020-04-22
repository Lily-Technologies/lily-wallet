import React from 'react';

import { CaravanFileUpload } from '../../components';

const UploadCaravanFile = () => {

  return (
    <FormContainer>
      <SelectDeviceContainer>
        <SpendHeaderWrapper>
          <MainMenuHeader to="..">{'<'} Main Menu</MainMenuHeader>
          <SelectDeviceHeader>View Wallet</SelectDeviceHeader>
        </SpendHeaderWrapper>
        <CaravanFileUpload caravanFile={caravanFile} setCaravanFile={setCaravanFile} step={step} setStep={setStep} />
      </SelectDeviceContainer>
    </FormContainer>
  )
}