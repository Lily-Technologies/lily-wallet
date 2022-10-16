import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';
import { CheckCircle } from '@styled-icons/material';
import { Bitcoin } from '@styled-icons/boxicons-logos';
import { Psbt, Network } from 'bitcoinjs-lib';

import { StyledIcon, SidewaysShake, Dropdown, SlideOver, Price } from 'src/components';

import { orange500, orange200 } from 'src/utils/colors';
import { downloadFile, formatFilename } from 'src/utils/files';
import { getFee, RecipientItem, truncateAddress } from 'src/utils/send';
import { createMap } from 'src/utils/accountMap';
import { FeeSelector } from './FeeSelector';
import AddSignatureFromQrCode from '../Onchain/AddSignatureFromQrCode';
import TransactionUtxoDetails from './TxUtxoDetails';
import ShoppingCart from './ShoppingCart';
import UnfundedPsbtAlert from './UnfundedPsbtAlert';

import { LilyOnchainAccount, Device, FeeRates, ShoppingItem, UTXO } from '@lily/types';

import { PlatformContext, UnitContext } from 'src/context';

const ABSURD_FEE = 1000000; // 0.01 BTC

interface Props {
  finalPsbt: Psbt;
  sendTransaction: () => void;
  feeRates: FeeRates;
  currentAccount: LilyOnchainAccount;
  signedDevices: Device[];
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  currentBitcoinPrice: any; // KBC-TODO: change to be more specific
  createTransactionAndSetState?: (
    recipients: RecipientItem[],
    _fee: number,
    desiredUtxos?: UTXO[]
  ) => Promise<Psbt>;
  currentBitcoinNetwork: Network;
  shoppingItems?: ShoppingItem[];
}

const TransactionDetails = ({
  finalPsbt,
  sendTransaction,
  feeRates,
  currentAccount,
  signedDevices,
  setStep,
  currentBitcoinPrice,
  createTransactionAndSetState,
  currentBitcoinNetwork,
  shoppingItems
}: Props) => {
  const { platform } = useContext(PlatformContext);
  const { getValue } = useContext(UnitContext);
  const signThreshold = currentAccount.config.quorum.requiredSigners;
  const { transactions, changeAddresses, unusedChangeAddresses } = currentAccount;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const changeAddressMap = createMap([...changeAddresses, ...unusedChangeAddresses], 'address');

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const _fee = getFee(finalPsbt, transactions);

  const downloadPsbt = async () => {
    try {
      const psbtForDownload = finalPsbt.toBase64();
      await downloadFile(
        psbtForDownload,
        formatFilename('tx', currentBitcoinNetwork, 'psbt'),
        platform
      );
      openInModal(<PsbtDownloadDetails />);
    } catch (e) {}
  };

  const viewTxQrCode = () => {
    openInModal(
      <AddSignatureFromQrCode
        importSignatureFromFile={() => {}}
        psbt={finalPsbt}
        currentBitcoinPrice={currentBitcoinPrice}
      />
    );
  };

  const adjustInputs = async (utxos: UTXO[]) => {
    const psbt = await createTransactionAndSetState!(
      [
        {
          address: finalPsbt.txOutputs[0].address!,
          value: Number(finalPsbt.txOutputs[0].value.toString())
        }
      ],
      0,
      utxos
    );

    setModalContent(
      <TransactionUtxoDetails
        currentAccount={currentAccount}
        psbt={psbt}
        adjustInputs={adjustInputs}
      />
    );
    return psbt;
  };

  const TransactionOptionsDropdown = () => {
    const dropdownItems = [
      {
        label: 'Save transaction to file',
        onClick: () => {
          downloadPsbt();
        }
      },
      {
        label: 'View transaction QR code',
        onClick: () => {
          viewTxQrCode();
        }
      }
    ];

    if (
      setStep !== undefined &&
      createTransactionAndSetState &&
      (!signedDevices.length || currentAccount.config.mnemonic)
    ) {
      dropdownItems.unshift({
        label: 'Adjust transaction fee',
        onClick: () => {
          openInModal(
            <FeeSelector
              currentAccount={currentAccount}
              finalPsbt={finalPsbt}
              feeRates={feeRates}
              recipientAddress={finalPsbt.txOutputs[0].address!}
              sendAmount={finalPsbt.txOutputs[0].value.toString()}
              closeModal={closeModal}
              createTransactionAndSetState={createTransactionAndSetState}
              currentBitcoinPrice={currentBitcoinPrice}
            />
          );
        }
      });
    }

    // if we are creating the transaction ourselves, give options for adjustment
    if (setStep !== undefined) {
      dropdownItems.unshift({
        label: 'View transaction details',
        onClick: () => {
          openInModal(
            <TransactionUtxoDetails
              currentAccount={currentAccount}
              psbt={finalPsbt}
              adjustInputs={adjustInputs}
            />
          );
        }
      });
    }

    if ((setStep !== undefined && !signedDevices.length) || currentAccount.config.mnemonic) {
      // eslint-disable-line
      dropdownItems.unshift({
        label: 'Edit transaction',
        onClick: () => setStep && setStep(0)
      });
    }

    return (
      <>
        <Dropdown
          className='text-sm'
          data-cy='send-options-dropdown'
          minimal={true}
          dropdownItems={dropdownItems}
        />
      </>
    );
  };

  const PsbtDownloadDetails = () => (
    <>
      <div className='border-b border-slate-200 dark:border-slate-600 flex items-center justify-between px-6 py-7'>
        <span className='dark:text-white text-2xl'>Download complete</span>
      </div>
      <ModalBody>
        <div className='text-green-500'>
          <StyledIcon as={CheckCircle} size={100} />
        </div>
        <p className='text-slate-800 dark:text-slate-300'>
          Your PSBT file has been saved successfully.
        </p>
      </ModalBody>
    </>
  );

  return (
    <>
      <AccountSendContentRight className='col-span-12 lg:col-span-6'>
        <SendDetailsContainer className='bg-white dark:bg-slate-800 dark:highlight-white/10'>
          <ModalHeaderContainer className='border-b border-slate-200 dark:border-slate-700'>
            <span className='text-xl font-medium text-slate-900 dark:text-slate-100'>
              Transaction summary
            </span>
            <span className='flex justify-end text-slate-900 dark:text-slate-200'>
              <TransactionOptionsDropdown />
            </span>
          </ModalHeaderContainer>
          <UnfundedPsbtAlert
            hidden={!!finalPsbt.inputCount}
            addInputs={() =>
              createTransactionAndSetState!(
                finalPsbt.txOutputs as RecipientItem[],
                feeRates['halfHourFee']
              )
            }
          />
          {shoppingItems ? (
            <ShoppingCart items={shoppingItems} />
          ) : (
            <ShoppingCart
              items={finalPsbt.txOutputs
                .filter((output) => !!!changeAddressMap[output.address!])
                .map((output, index) => {
                  return {
                    header: `Send ${getValue(output.value)} to`,
                    subtext: truncateAddress(output.address!),
                    image: <Bitcoin className='h-12 w-12 text-yellow-500' />
                  };
                })}
            />
          )}
          <div className='py-6 px-4 space-y-6 sm:px-6'>
            <div className='flex flex-wrap justify-between'>
              <div className='text-slate-900 dark:text-slate-200'>From</div>
              <div className='text-slate-900 dark:text-slate-200 font-medium'>
                {currentAccount.name}
              </div>
            </div>

            <div className='flex flex-wrap justify-between'>
              <div className='text-slate-900 dark:text-slate-200'>Network fee</div>
              <div className='text-slate-900 dark:text-slate-200 font-medium'>
                <span data-cy='transactionFeeBtc'>
                  {getValue(_fee)} (<Price value={_fee} />)
                </span>
              </div>
            </div>
            {_fee >= ABSURD_FEE && <WarningBox>Warning: transaction fee is very high</WarningBox>}

            <div className='flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6'>
              <div className='text-slate-900 dark:text-slate-200'>Total</div>
              <div className='text-slate-900 dark:text-slate-200 font-medium'>
                {getValue(finalPsbt.txOutputs[0].value + _fee)}
              </div>
            </div>
          </div>
          <div className='border-t border-slate-200 dark:border-slate-700 py-6 px-4 sm:px-6'>
            <button
              className='py-4 px-6 bg-green-500 hover:bg-green-600 text-white flex w-full rounded-lg text-center font-semibold items-center justify-center'
              onClick={() => sendTransaction()}
            >
              {signedDevices.length < signThreshold
                ? `Confirm on Devices (${signedDevices.length}/${signThreshold})`
                : 'Broadcast Transaction'}
              {signedDevices.length < signThreshold ? null : (
                <SendButtonCheckmark>
                  <StyledIcon as={ArrowIosForwardOutline} size={16} />
                </SendButtonCheckmark>
              )}
            </button>
          </div>
        </SendDetailsContainer>
      </AccountSendContentRight>
      <SlideOver
        open={modalIsOpen}
        setOpen={setModalIsOpen}
        content={modalContent}
        className='max-w-4xl'
      ></SlideOver>
    </>
  );
};

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5em;
`;

const ModalHeaderContainer = styled.div`
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
  height: 90px;
`;

const AccountSendContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const SendDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.375rem;
`;

const SendButtonCheckmark = styled.div`
  animation: 1s ease infinite ${SidewaysShake};
`;

const WarningBox = styled.div`
  padding: 1.5em;
  background: ${orange200};
  color: ${orange500};
  border: 1px solid ${orange500};
  margin: 1.5em 0;
`;

export default TransactionDetails;
