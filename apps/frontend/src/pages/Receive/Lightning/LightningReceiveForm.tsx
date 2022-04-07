import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { Input, Spinner, Select, UnitInput } from 'src/components';

import { LilyLightningAccount } from '@lily/types';
import { SetStateNumber, SetStateString } from 'src/types';
import { requireLightning } from 'src/hocs';

import { AccountMapContext, PlatformContext } from 'src/context';

interface Props {
  setStep: SetStateNumber;
  setInvoice: SetStateString;
  currentAccount: LilyLightningAccount;
}

const LightningReceiveForm = ({ setStep, setInvoice, currentAccount }: Props) => {
  const { platform } = useContext(PlatformContext);
  const { accountMap, setCurrentAccountId } = useContext(AccountMapContext);
  const [memo, setMemo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sendAmountError, setSendAmountError] = useState('');
  const [memoError, setMemoError] = useState('');
  const { config } = currentAccount;

  const validateForm = (_recipientAddress: string, _sendAmount: string): boolean => {
    let valid = true;
    if (memo.length > 50) {
      valid = false;
      setMemoError('Memo too long');
    }
    return valid;
  };

  const submitForm = async (_recipientAddress: string, _sendAmount: string) => {
    const valid = validateForm(_recipientAddress, _sendAmount);
    if (valid) {
      try {
        setIsLoading(true);
        const { paymentRequest } = await platform.generateLightningInvoice({
          memo: memo,
          value: sendAmount,
          lndConnectUri: config.connectionDetails.lndConnectUri
        });

        setInvoice(paymentRequest);
        setStep(1);
      } catch (e) {
        setSendAmountError('Unable to create invoice');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-md shadow'>
      <div className='py-6 px-4 sm:p-6 ' data-cy='send-form'>
        <div className='grid grid-cols-4 gap-6'>
          <div className='col-span-4 lg:col-span-2'>
            <Select
              label='From account'
              initialSelection={{
                label: currentAccount.config.name,
                onClick: () => setCurrentAccountId(currentAccount.config.id)
              }}
              options={Object.values(accountMap).map((item) => {
                return {
                  label: item.name,
                  onClick: () => {
                    setCurrentAccountId(item.config.id);
                  }
                };
              })}
            />
          </div>
          <div className='col-span-4'>
            <Input
              label='Invoice memo'
              type='text'
              onChange={setMemo}
              value={memo}
              placeholder={'Morning coffee'}
              error={memoError}
              id='lightning-memo'
              style={{ textAlign: 'right' }}
            />
          </div>
          <div className='col-span-4'>
            <UnitInput
              label='Invoice amount'
              inputMode='decimal'
              value={sendAmount}
              onChange={setSendAmount}
              error={sendAmountError}
              id='lightning-amount'
            />
          </div>
        </div>
      </div>
      <div className='text-right py-3 px-4 mt-2 border bg-gray-50 dark:bg-gray-700 dark:border-gray-900 rounded-bl-md rounded-br-md'>
        <button
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
          disabled={isLoading}
          onClick={() => submitForm(memo, sendAmount)}
        >
          {isLoading ? (
            <>
              <Spinner /> <ButtonText>Generating invoice</ButtonText>
            </>
          ) : (
            'Generate invoice'
          )}
        </button>
      </div>
    </div>
  );
};

const ButtonText = styled.span`
  margin-left: 0.75rem;
`;

export default requireLightning(LightningReceiveForm);
