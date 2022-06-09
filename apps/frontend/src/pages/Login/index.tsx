import React, { useState, useEffect } from 'react';
import FlowerHeroImage from 'src/assets/lily-image.jpg';

import { Loading } from 'src/components';

import { File } from '@lily/types';

import UnlockForm from './UnlockForm';
import SignupForm from './SignupForm';

interface Props {
  encryptedConfigFile: File | null;
  setEncryptedConfigFile: React.Dispatch<React.SetStateAction<File | null>>;
  currentBlockHeight: number | undefined;
  fetchingEncryptedConfig: boolean;
}

const Login = ({
  encryptedConfigFile,
  setEncryptedConfigFile,
  currentBlockHeight,
  fetchingEncryptedConfig
}: Props) => {
  const [mode, setMode] = useState<'unlock' | 'create'>('unlock');

  useEffect(() => {
    if (!fetchingEncryptedConfig && !encryptedConfigFile) {
      onClickCreateNew();
    }
  }, [fetchingEncryptedConfig, encryptedConfigFile]);

  const onClickCreateNew = () => {
    setMode('create');
  };

  return (
    <div className='flex-auto min-h-full flex bg-white dark:bg-gray-900'>
      <div className='flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        {fetchingEncryptedConfig ? <Loading message='Initializing...' /> : null}
        {!fetchingEncryptedConfig && mode === 'unlock' ? (
          <UnlockForm
            encryptedConfigFile={encryptedConfigFile}
            fetchingEncryptedConfig={fetchingEncryptedConfig}
            setEncryptedConfigFile={setEncryptedConfigFile}
            currentBlockHeight={currentBlockHeight}
            onClickCreateNew={onClickCreateNew}
          />
        ) : null}
        {!fetchingEncryptedConfig && mode === 'create' ? (
          <SignupForm encryptedConfigFile={encryptedConfigFile} cancel={() => setMode('unlock')} />
        ) : null}
      </div>
      <div className='hidden lg:block relative w-0 flex-1'>
        <img
          className='absolute inset-0 h-full w-full object-cover'
          src={FlowerHeroImage}
          alt='Lily hero image'
        />
      </div>
    </div>
  );
};

export default Login;
