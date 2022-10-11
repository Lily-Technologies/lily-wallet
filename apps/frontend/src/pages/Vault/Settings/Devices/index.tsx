import React, { useContext, useState } from 'react';

import { DeviceImage, SettingsTable, SlideOver } from 'src/components';

import DeviceDetails from './DeviceDetails';

import { requireOnchain } from 'src/hocs';

import { LilyConfig, ExtendedPublicKey, VaultConfig, OnChainConfig } from '@lily/types';
import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';

import { saveConfig } from 'src/utils/files';

const DevicesView = () => {
  const { config, password, setConfigFile } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { currentAccount } = useContext(AccountMapContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const saveOwner = async (extendedPublicKey: ExtendedPublicKey) => {
    const clonedAccountConfig: VaultConfig = { ...(currentAccount.config as VaultConfig) };
    const extendedPublicKeysWithOwner = clonedAccountConfig.extendedPublicKeys.map((key) => {
      if (key.id === extendedPublicKey.id) {
        return extendedPublicKey;
      }
      return key;
    });
    clonedAccountConfig.extendedPublicKeys = extendedPublicKeysWithOwner;

    const updatedConfig: LilyConfig = {
      ...config,
      vaults: config.vaults.map((vault) =>
        vault.id === clonedAccountConfig.id ? clonedAccountConfig : vault
      )
    };

    await saveConfig(updatedConfig, password, platform);
    setConfigFile(updatedConfig);
  };

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Device Information</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          Information about the devices that approve transactions for this account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <div className='bg-gray-50 dark:bg-slate-900 py-8 rounded-2xl mt-6 shadow-inner border border-slate-900/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <ul
            role='list'
            className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-3 px-2'
          >
            {(currentAccount.config as OnChainConfig).extendedPublicKeys?.map((item) => (
              <li
                key={item.device.fingerprint}
                className='col-span-1 flex flex-col flex-none text-center relative border border-slate-900/10 z-10 rounded-xl shadow bg-white hover:bg-gray-200 overflow-hidden my-auto xl:mt-18 dark:bg-slate-600 dark:hover:bg-slate-500 dark:highlight-white/10'
              >
                <button
                  className='rounded-xl mb-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500'
                  onClick={() =>
                    openInModal(
                      <DeviceDetails
                        extendedPublicKey={item}
                        closeModal={() => closeModal()}
                        onSave={saveOwner}
                      />
                    )
                  }
                >
                  <div className='flex-1 flex flex-col p-8'>
                    <DeviceImage
                      className='w-28 h-48 shrink-0 mx-auto object-contain'
                      device={item.device}
                    />
                    <h3 className='mt-4 text-gray-900 dark:text-white text-md font-medium capitalize'>
                      {item.device.type}
                    </h3>
                    <dl className='mt-0 flex-grow flex flex-col justify-between'>
                      <dt className='sr-only'>Type</dt>
                      <dd className='text-gray-500 dark:text-gray-300 text-xs uppercase'>
                        {item.device.fingerprint}
                      </dd>
                      <dt className='sr-only'>Fingerprint</dt>
                    </dl>
                  </div>
                  <div>
                    <div className='-mt-px flex divide-x divide-gray-200'>
                      <div className='w-0 flex-1 flex'>
                        {/* <a
                  href={`mailto:${person.email}`}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  <MailIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Email</span>
                </a>
              </div>
              <div className="-ml-px w-0 flex-1 flex">
                <a
                  href={`tel:${person.telephone}`}
                  className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                >
                  <PhoneIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Call</span>
                </a> */}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SlideOver open={modalIsOpen} setOpen={setModalIsOpen} content={modalContent} />
    </SettingsTable.Wrapper>
  );
};

export default requireOnchain(DevicesView);
