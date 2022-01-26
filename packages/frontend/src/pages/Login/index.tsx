import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Network } from 'bitcoinjs-lib';
import FlowerHeroImage from 'src/assets/lily-image.jpg';

import { File } from '@lily/types';
import { ConfigContext, PlatformContext } from 'src/context';

import UnlockForm from './UnlockForm';
import SignupForm from './SignupForm';

interface Props {
  encryptedConfigFile: File | null;
  setEncryptedConfigFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  currentBlockHeight: number | undefined;
  fetchingEncryptedConfig: boolean;
}

const Login = ({
  encryptedConfigFile,
  setEncryptedConfigFile,
  setPassword,
  currentBlockHeight,
  fetchingEncryptedConfig
}: Props) => {
  const [mode, setMode] = useState<'unlock' | 'create'>('unlock');

  const onClickCreateNew = () => {
    setMode('create');
  };

  return (
    <div className='min-h-full flex bg-white'>
      <div className='flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        {mode === 'unlock' ? (
          <UnlockForm
            encryptedConfigFile={encryptedConfigFile}
            fetchingEncryptedConfig={fetchingEncryptedConfig}
            setEncryptedConfigFile={setEncryptedConfigFile}
            setPassword={setPassword}
            currentBlockHeight={currentBlockHeight}
            onClickCreateNew={onClickCreateNew}
          />
        ) : (
          <SignupForm setPassword={setPassword} cancel={() => setMode('unlock')} />
        )}
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
