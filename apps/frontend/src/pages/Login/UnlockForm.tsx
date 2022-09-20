import { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AES, enc } from 'crypto-js';
import moment from 'moment';

import { ConfigContext, PlatformContext } from 'src/context';
import { FileUploader, Input } from 'src/components';
import {
  updateConfigFileVersionOne,
  updateConfigFileVersionBeta,
  updateConfigFileVersionOneDotFive,
  updateConfigFileVersionOneDotSeven
} from 'src/utils/migration';
import { saveConfig } from 'src/utils/files';

import FlowerLogo from 'src/assets/flower.svg';
import FlowerLoading from 'src/assets/flower-loading.svg';

import { File } from '@lily/types';

interface Props {
  encryptedConfigFile: File | null;
  fetchingEncryptedConfig: boolean;
  setEncryptedConfigFile: (value: React.SetStateAction<File | null>) => void;
  currentBlockHeight: number | undefined;
  onClickCreateNew: () => void;
}

const UnlockForm = ({
  encryptedConfigFile,
  setEncryptedConfigFile,
  fetchingEncryptedConfig,
  currentBlockHeight,
  onClickCreateNew
}: Props) => {
  const history = useHistory();
  const location = useLocation();
  const [localPassword, setLocalPassword] = useState('');
  const { setConfigFile, setPassword } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const unlockFile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (encryptedConfigFile) {
      setIsLoading(true);
      try {
        const bytes = AES.decrypt(encryptedConfigFile.file, localPassword);
        const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
        const migratedConfig = updateConfigFileVersionOneDotSeven(
          updateConfigFileVersionOneDotFive(
            updateConfigFileVersionOne(
              updateConfigFileVersionBeta(decryptedData, currentBlockHeight!)
            )
          )
        );

        setPasswordError('');
        setTimeout(() => {
          setConfigFile(migratedConfig);
          setPassword(localPassword);
          saveConfig(migratedConfig, localPassword, platform); // we resave the file after opening to update the modifiedDate value
          setIsLoading(false);
          history.push('/', {
            search: location.search
          });
        }, 2000);
      } catch (e) {
        setPasswordError('Incorrect Password');
        setIsLoading(false);
      }
    }
  };

  const changeLocalPassword = (value: string) => {
    setPasswordError('');
    setLocalPassword(value);
  };

  return (
    <div className='mx-auto w-full max-w-sm lg:w-96'>
      <FileUploader
        accept='.txt'
        id='localConfigFile'
        onFileLoad={(file: File) => {
          setEncryptedConfigFile(file);
        }}
      />

      <div>
        <img className='h-12 w-auto' src={FlowerLogo} alt='Lily Wallet logo' />
        <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-200'>
          Unlock your wallet
        </h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Or{' '}
          <label
            htmlFor='localConfigFile'
            className='cursor-pointer font-medium text-green-600 dark:text-green-500 hover:text-green-500 hover:text-green-400'
          >
            restore from a backup
          </label>
        </p>
      </div>
      <div className='mt-8'>
        <div className='mt-6'>
          <form onSubmit={unlockFile} className='space-y-6'>
            <div className='space-y-1'>
              <Input
                label='Password'
                onChange={changeLocalPassword}
                value={localPassword}
                error={passwordError}
                type='password'
                autoComplete='current-password'
                required
                autoFocus
              />
              <div
                className={'flex items-center justify-end'}
                style={{ marginTop: !!passwordError ? '-1em' : '0.25rem' }}
              >
                {!fetchingEncryptedConfig && (
                  <div className='flex items-end text-xs text-gray-400'>
                    Last accessed on{' '}
                    {encryptedConfigFile &&
                      moment(encryptedConfigFile.modifiedTime).format('MM/DD/YYYY')}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={fetchingEncryptedConfig && !encryptedConfigFile}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                {isLoading && <LoadingImage alt='loading placeholder' src={FlowerLoading} />}
                {fetchingEncryptedConfig
                  ? 'Loading wallet...'
                  : isLoading
                  ? 'Unlocking wallet...'
                  : 'Unlock wallet'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='mt-6 relative'>
        <div className='absolute inset-0 flex items-center' aria-hidden='true'>
          <div className='w-full border-t border-gray-300 dark:border-gray-500' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-300'>
            Don't have a wallet?
          </span>
        </div>
      </div>
      <button
        onClick={() => onClickCreateNew()}
        className='cursor-pointer w-full mt-4 inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500'
      >
        Create a new wallet
      </button>
    </div>
  );
};

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-left: 0.25em;
  opacity: 0.9;
  margin-right: 0.5em;
`;

export default UnlockForm;
