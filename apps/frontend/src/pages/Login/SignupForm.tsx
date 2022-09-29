import { useContext, useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/outline';

import { Input } from 'src/components';

import { ConfigContext, PlatformContext } from 'src/context';

import { saveConfig } from 'src/utils/files';

import { ReactComponent as FlowerLogo } from 'src/assets/flower.svg';
import FlowerLoading from 'src/assets/flower-loading.svg';

import { File } from '@lily/types';

const MIN_PASSWORD_LENGTH = 8;

interface Props {
  cancel: () => void;
  encryptedConfigFile: File | null;
}

const SignupForm = ({ encryptedConfigFile, cancel }: Props) => {
  const { config, setConfigFile, setPassword } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const [isLoading, setIsLoading] = useState(false);
  const [localPassword, setLocalPassword] = useState('');
  const [localConfirmPassword, setLocalConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateInput = () => {
    if (!!localPassword && localPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return false;
    } else if (!!passwordError) {
      setPasswordError('');
    }

    if (!!localPassword && !!localConfirmPassword && localPassword !== localConfirmPassword) {
      setConfirmPasswordError("Password doesn't match confirmation");
      return false;
    } else {
      setPasswordError('');
      setConfirmPasswordError('');
      return true;
    }
  };

  const createNewConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (validateInput()) {
        const configCopy = { ...config };
        configCopy.isEmpty = false;
        setTimeout(() => {
          setConfigFile(configCopy);
          saveConfig(configCopy, localPassword, platform); // we save a blank config file
          setPassword(localPassword);
          setIsLoading(false);
        }, 2000);
      }
    } catch (e) {
      setPasswordError('Error. Try again.');
      setIsLoading(false);
    }
  };

  const changeLocalPassword = (value: string) => {
    setPasswordError('');
    setLocalPassword(value);
  };

  const changeConfirmPassword = (value: string) => {
    setConfirmPasswordError('');
    setLocalConfirmPassword(value);
  };

  return (
    <div className='mx-auto w-full max-w-sm lg:w-96'>
      <div>
        <FlowerLogo className='h-12 w-auto' />
        <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-200'>
          Getting started
        </h2>
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-500'>
          Input a password to secure your wallet.
        </p>
      </div>
      <div className='mt-8'>
        <div className='mt-6'>
          <form onSubmit={(e) => createNewConfig(e)} className='space-y-6'>
            <div className='space-y-1'>
              <Input
                label='Password'
                type='password'
                value={localPassword}
                onChange={changeLocalPassword}
                error={passwordError}
                autoComplete='new-password'
                required
                autoFocus
              />
            </div>
            <div className='space-y-1'>
              <Input
                label='Confirm password'
                type='password'
                value={localConfirmPassword}
                onChange={changeConfirmPassword}
                error={confirmPasswordError}
                autoComplete='new-password'
                required
              />
            </div>

            <div className='flex justify-end'>
              {encryptedConfigFile ? (
                <button
                  type='button'
                  onClick={cancel}
                  className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-green-500'
                >
                  Cancel
                </button>
              ) : null}

              <button
                type='submit'
                className='group ml-3 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
              >
                {isLoading ? 'Loading...' : 'Continue'}
                {isLoading ? (
                  <img
                    alt='loading placeholder'
                    src={FlowerLoading}
                    className='w-4 h-4 ml-1 brightness-0 invert'
                  />
                ) : (
                  <ArrowRightIcon className='w-4 h-4 ml-2 group-hover:translate-x-1 transition ease-in-out duration-100' />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
