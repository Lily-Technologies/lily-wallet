import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { RadioGroup, Transition } from '@headlessui/react';
import { Psbt } from 'bitcoinjs-lib';

import { Button, Input, Price, Unit } from 'src/components';
import { getFee, RecipientItem } from 'src/utils/send';
import { classNames } from 'src/utils/other';

import {
  gray50,
  gray100,
  gray300,
  gray400,
  gray500,
  gray600,
  green200,
  green500
} from 'src/utils/colors';

import { LilyOnchainAccount, FeeRates, FeeRateOptions } from '@lily/types';
import { ChevronRight } from '@styled-icons/heroicons-solid';

const getFeeName = (fee: FeeRateOptions) => {
  if (fee === 'fastestFee') return 'Fastest';
  if (fee === 'halfHourFee') return 'Normal';
  return 'Slow';
};

const getFeePrimaryDescription = (fee: FeeRateOptions) => {
  if (fee === 'fastestFee') return '1 block';
  if (fee === 'halfHourFee') return '3 blocks';
  return '6 blocks';
};

const getFeeSecondaryDescription = (fee: FeeRateOptions) => {
  if (fee === 'fastestFee') return 'Ten minutes';
  if (fee === 'halfHourFee') return 'Thirty minutes';
  return 'An hour';
};

interface Props {
  currentAccount: LilyOnchainAccount;
  finalPsbt: Psbt;
  feeRates: FeeRates;
  recipientAddress: string;
  sendAmount: string;
  closeModal(): void;
  createTransactionAndSetState(recipients: RecipientItem[], _fee: number): Promise<Psbt>;
  currentBitcoinPrice: any; // KBC-TODO: change to be more specific
}

export const FeeSelector = ({
  currentAccount,
  finalPsbt,
  feeRates,
  recipientAddress,
  sendAmount,
  closeModal,
  createTransactionAndSetState
}: Props) => {
  const [customFeeRate, setCustomFeeRate] = useState(0);
  const [unsavedFeeRate, setUnsavedFeeRate] = useState<number | undefined>(undefined);
  const [customFeeRateError, setCustomFeeRateError] = useState('');

  const validateCustomFee = () => {
    if (customFeeRate! < 0) {
      setCustomFeeRateError('Cannot set a negative fee!');
      return false;
    }
    if (customFeeRate! > 0 && customFeeRateError) {
      setCustomFeeRateError('');
    }
    return true;
  };

  const selectFee = async (feeRate: number) => {
    try {
      await createTransactionAndSetState(
        [{ address: recipientAddress, value: Number(sendAmount) }],
        feeRate
      );
      closeModal();
    } catch (e) {
      console.log('e: ', e);
      if (e instanceof Error) {
        setCustomFeeRateError(e.message);
      }
    }
  };

  return (
    <div>
      <div className='bg-white pt-6 px-4 space-y-6 sm:px-6 sm:pt-6 rounded-lg'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>Adjust transaction fee</h3>
        <RadioGroup value={unsavedFeeRate} onChange={setUnsavedFeeRate}>
          <RadioGroup.Label className='sr-only'>Transaction fee</RadioGroup.Label>
          <div className='space-y-4'>
            {(Object.keys(feeRates) as Array<FeeRateOptions>)
              // filter out duplicate fee rates
              .filter((item, index, items) => feeRates[item] !== feeRates[items[index - 1]])
              .map((option) => (
                <RadioGroup.Option
                  key={option}
                  value={feeRates[option]}
                  className={({ checked, active }) =>
                    classNames(
                      checked ? 'border-transparent bg-green-50' : 'border-gray-300',
                      active ? 'border-green-500 ring-2 ring-green-500' : '',
                      'relative block bg-white border rounded-lg shadow-sm px-6 py-4 cursor-pointer sm:flex sm:justify-between focus:outline-none'
                    )
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className='flex items-center'>
                        <div className='text-sm'>
                          <RadioGroup.Label as='p' className='font-medium text-gray-900'>
                            {getFeeName(option)}
                          </RadioGroup.Label>
                          <RadioGroup.Description as='div' className='text-gray-500'>
                            <p className='sm:inline'>{getFeePrimaryDescription(option)}</p>{' '}
                            <span className='hidden sm:inline sm:mx-1' aria-hidden='true'>
                              &middot;
                            </span>{' '}
                            <p className='sm:inline'>{getFeeSecondaryDescription(option)}</p>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      <RadioGroup.Description
                        as='div'
                        className='mt-2 flex text-sm sm:mt-0 sm:block sm:ml-4 sm:text-right'
                      >
                        <div className='font-medium text-gray-900'>{feeRates[option]} sat/vB</div>
                        <div className='ml-1 text-gray-500 sm:ml-0'>
                          <Price value={feeRates[option]} />
                        </div>
                      </RadioGroup.Description>
                      <div
                        className={classNames(
                          active ? 'border' : 'border-2',
                          checked ? 'border-green-500' : 'border-transparent',
                          'absolute -inset-px rounded-lg pointer-events-none'
                        )}
                        aria-hidden='true'
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            <RadioGroup.Option
              value={customFeeRate}
              className={({ checked, active }) =>
                classNames(
                  checked
                    ? 'border-transparent bg-green-50 border-b-0 shadow-none'
                    : 'border-gray-300',
                  active ? 'border-green-500 border-b-0 shadow-none' : '',
                  'relative block bg-white border rounded-lg shadow-sm px-6 py-4 cursor-pointer sm:flex sm:justify-between focus:outline-none'
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <div className='flex items-center'>
                    <div className='text-sm'>
                      <RadioGroup.Label as='p' className='font-medium text-gray-900'>
                        Custom
                      </RadioGroup.Label>
                      <RadioGroup.Description as='div' className='text-gray-500'>
                        <p className='sm:inline'>Set a custom fee</p>{' '}
                        <span className='hidden sm:inline sm:mx-1' aria-hidden='true'>
                          &middot;
                        </span>{' '}
                        {/* <p className='sm:inline'>{getFeeSecondaryDescription(option)}</p> */}
                      </RadioGroup.Description>
                    </div>
                  </div>
                  <RadioGroup.Description
                    as='div'
                    className='mt-2 flex items-center text-sm sm:mt-0 sm:ml-4 sm:text-right'
                  >
                    <div className=''>
                      <ChevronRight
                        className={classNames(
                          active || checked ? 'transform transition rotate-90 ' : 'rotate-0',
                          'h-6 w-6'
                        )}
                      />
                    </div>
                    {/* <div className='font-medium text-gray-900'>
                      <Unit value={feeRates[option]} />
                    </div>
                    <div className='ml-1 text-gray-500 sm:ml-0'>
                      <Price value={feeRates[option]} />
                    </div> */}
                  </RadioGroup.Description>
                  <div
                    className={classNames(
                      active
                        ? 'border-green-500 rounded-b-none rounded-b-none border-t-4 border-l-4 border-r-4'
                        : 'border-transparent',
                      checked
                        ? 'border-green-500 rounded-b-none rounded-b-none border-t-4 border-l-4 border-r-4'
                        : 'border-transparent',
                      'absolute -inset-px rounded-lg pointer-events-none'
                    )}
                    aria-hidden='true'
                  />
                </>
              )}
            </RadioGroup.Option>
          </div>
        </RadioGroup>
      </div>
      <Transition
        className='px-4 sm:px-6'
        as='div'
        show={customFeeRate === unsavedFeeRate}
        enter='transform transition duration-75'
        enterFrom='-translate-y-full opacity-0'
        enterTo='translate-y-0 opacity-100'
        leave='transform duration-75 transition ease-in-out'
        leaveFrom='translate-y-0 opacity-100'
        leaveTo='-translate-y-full opacity-0'
      >
        <div className='w-full h-full bg-white rounded-md shadow-lg' />
        <div className='px-4 -mt-1 bg-green-50 shadow-sm border-green-500 rounded-b-lg border-t-0 border-b-4 border-l-4 border-r-4'>
          <div className='px-6 pb-4'>
            <Input
              autoFocus
              type='text'
              onChange={(value) => {
                setUnsavedFeeRate(Number(value));
                setCustomFeeRate(Number(value));
                validateCustomFee();
              }}
              value={customFeeRate.toString()}
              onBlur={(e) => {
                setUnsavedFeeRate(customFeeRate);
              }}
              placeholder={'5'}
              error={customFeeRateError}
              inputStaticText='sat/vB'
              id='custom-fee'
              style={{ paddingRight: '4em' }}
            />
          </div>
        </div>
      </Transition>

      <div>{customFeeRateError}</div>
      <div className='px-4 py-3 bg-gray-50 text-right sm:px-6 mt-6'>
        <button
          type='button'
          className='justify-center mr-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-green-500'
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (unsavedFeeRate) {
              selectFee(unsavedFeeRate);
            }
          }}
          className='bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
        >
          Adjust fee
        </button>
      </div>
    </div>
  );
};
