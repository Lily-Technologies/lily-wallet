import React, { useState } from 'react';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  SparklesIcon,
  DuplicateIcon,
  ClipboardCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/outline';

import { Input, Textarea, Counter } from 'src/components';

import { generateSetupDeepLinkRedirectUrl } from 'src/utils/files';
import { classNames } from 'src/utils/other';

import { OnChainConfigWithoutId } from '@lily/types';

import { InnerTransition } from './InnerTransition';

interface Props {
  newAccount: OnChainConfigWithoutId;
  setNewAccount: (account: OnChainConfigWithoutId) => void;
}

const RequestDeviceViaEmail = ({ newAccount, setNewAccount }: Props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mailtoLink, setMailtoLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showNumberDevicesRequested, setShowNumberDevicesRequested] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [numberDevicesRequested, setNumberDevicesRequested] = useState(1);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const requestAdditionalDevices = () => {
    const newAccountWithEmail: OnChainConfigWithoutId = {
      ...newAccount,
      quorum: {
        ...newAccount.quorum,
        // TODO: this is pretty inflexible, doesn't allow adding own devices after getting collaborator's
        totalSigners: newAccount.extendedPublicKeys.length + numberDevicesRequested
      },
      extendedPublicKeys: newAccount.extendedPublicKeys.map((item) => ({
        ...item,
        device: {
          ...item.device,
          owner: {
            name: item.device.owner?.name || name,
            email: item.device.owner?.email || email
          }
        }
      }))
    };

    setNewAccount(newAccountWithEmail);

    const generatedMailtoLink = generateSetupDeepLinkRedirectUrl(
      newAccountWithEmail,
      'incomplete',
      name,
      email
    );
    setMailtoLink(generatedMailtoLink);
  };

  return (
    <div
      className={classNames(
        'w-full transform overflow-hidden  bg-white dark:bg-slate-800 p-6 text-left rounded-2xl dark:highlight-white/10 border dark:border-white/[0.05]',
        'flex flex-col transition-max-height duration-500 ease-in-out',
        showEmailForm ? 'h-80' : 'h-full'
      )}
    >
      <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-white'>
        Request additional devices
      </h3>
      <div>
        <InnerTransition
          show={showNumberDevicesRequested}
          className='w-full h-64'
          afterLeave={() => setShowEmailForm(true)}
        >
          <>
            <div className='mt-2'>
              <p className='text-sm text-gray-500 dark:text-gray-400 max-w-prose'>
                How many devices do you want others to contribute?
              </p>
            </div>
            <div className='py-20'>
              <Counter
                value={numberDevicesRequested}
                setValue={setNumberDevicesRequested}
                minValue={1}
              />
            </div>
            <div className='flex items-end justify-end'>
              <button
                type='button'
                className='inline-flex items-center justify-center rounded-md border border-transparent bg-green-100 dark:bg-green-700 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 dark:hover:bg-green-600 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                tabIndex={0}
                onClick={() => {
                  requestAdditionalDevices();
                  setShowNumberDevicesRequested(false);
                }}
              >
                Continue
                <ArrowRightIcon className='ml-1.5 h-4 w-4' />
              </button>
            </div>
          </>
        </InnerTransition>
        <InnerTransition
          show={showEmailForm}
          className='w-full'
          afterLeave={() => setShowMagicLink(true)}
        >
          <>
            <div className='mt-2'>
              <p className='text-sm text-gray-500 dark:text-gray-400 max-w-prose'>
                Input your name and email below to generate a unique link to send to the other
                person you want to include in this vault. When they have added their devices, you
                will receive an email with a link to access the shared vault in Lily Wallet.
              </p>
            </div>
            <div className='flex flex-col'>
              <div className='flex flex-col p-6'>
                <InputRow>
                  <div className='flex flex-col'>
                    <StyledInput
                      value={name}
                      onChange={setName}
                      label='Your name'
                      type='text'
                      placeholder='Satoshi Nakamoto'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <StyledInput
                      value={email}
                      onChange={setEmail}
                      label='Your email'
                      type='text'
                      placeholder='satoshi@bitcoin.com'
                    />
                  </div>
                </InputRow>
              </div>

              <div className='mt-4 flex items-end justify-end px-5'>
                <button
                  type='button'
                  className='inline-flex items-center justify-center rounded-md border border-transparent bg-green-100 dark:bg-green-700 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 dark:hover:bg-green-600 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                  tabIndex={0}
                  onClick={() => {
                    requestAdditionalDevices();
                    setShowEmailForm(false);
                  }}
                >
                  Get magic link
                  <SparklesIcon className='ml-1.5 h-4 w-4' />
                </button>
              </div>
            </div>
          </>
        </InnerTransition>
        <InnerTransition
          show={showMagicLink}
          className='w-full'
          afterLeave={() => setShowEmailForm(true)}
        >
          <div className='flex flex-col'>
            <div className='mt-2'>
              <p className='text-sm text-gray-500 dark:text-gray-400 max-w-prose'>
                Share this link with another person you want to create a vault with. When they have
                added their device(s), you will receive an email with a link to access the shared
                vault in Lily Wallet.
              </p>
            </div>
            <div className='flex flex-col p-6'>
              <Textarea value={mailtoLink} />
            </div>

            <div className='mt-4 flex items-end justify-end px-5'>
              <button
                type='button'
                className='bg-white dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white dark:text-slate-100 py-2 px-4 border border-gray-300 dark:border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-slate-500'
                tabIndex={0}
                onClick={() => setShowMagicLink(false)}
              >
                Cancel
              </button>
              <CopyToClipboard text={mailtoLink} onCopy={() => onCopy()}>
                <button
                  type='button'
                  className='ml-2 inline-flex items-center justify-center rounded-md border border-transparent bg-green-100 dark:bg-green-700 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 dark:hover:bg-green-600 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                  tabIndex={0}
                >
                  Copy link
                  {copied ? (
                    <ClipboardCheckIcon className='ml-1.5 h-4 w-4' />
                  ) : (
                    <DuplicateIcon className='ml-1.5 h-4 w-4' />
                  )}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </InnerTransition>
      </div>
    </div>
  );
};

const StyledInput = styled(Input)`
  display: flex;
  flex-direction: column;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1em;
  margin-top: 1em;
`;

export default RequestDeviceViaEmail;
