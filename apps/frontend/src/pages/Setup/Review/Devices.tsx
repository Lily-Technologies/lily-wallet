import { useState } from 'react';
import { MailIcon, UserIcon } from '@heroicons/react/outline';

import { DeviceImage, SlideOver } from 'src/components';

import DeviceDetails from 'src/pages/Vault/Settings/Devices/DeviceDetails';

import { ExtendedPublicKey } from '@lily/types';

interface Props {
  extendedPublicKeys: ExtendedPublicKey[];
  onSave: (extendedPublicKey: ExtendedPublicKey) => void;
}

const Devices = ({ extendedPublicKeys, onSave }: Props) => {
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

  return (
    <div className='py-6 px-4'>
      <div className='bg-gray-50 dark:bg-gray-700 py-8 rounded-lg shadow-inner'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <ul
            role='list'
            className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-3 px-2'
          >
            {extendedPublicKeys.map((item) => (
              <li
                key={item.device.fingerprint}
                className='col-span-1 flex flex-col flex-none text-center bg-white dark:bg-gray-600 rounded-lg shadow divide-y divide-gray-200 border border-gray-200 dark:border-gray-700'
              >
                <div className='flex-1 flex flex-col py-6 px-4'>
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
                <div className='border-t border-gray-200 px-4 py-3'>
                  <p className='flex items-center text-xs text-gray-700 truncate'>
                    <UserIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400' />
                    {item.device.owner?.name || 'Not set'}
                  </p>
                  <p className='mt-2 flex items-center text-xs text-gray-700 truncate'>
                    <MailIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400' />
                    {item.device.owner?.email || 'Not set'}
                  </p>
                </div>
                <div className='border-t border-gray-200'>
                  <div className='-mt-px flex divide-x divide-gray-200'>
                    <div className='w-0 flex-1 flex'>
                      <button
                        // className=''
                        className='relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500'
                        onClick={() =>
                          openInModal(
                            <DeviceDetails
                              extendedPublicKey={item}
                              closeModal={() => closeModal()}
                              hideActionButtons={true}
                              onSave={onSave}
                            />
                          )
                        }
                      >
                        <a
                        //   href={`mailto:${person.email}`}
                        >
                          <span>View details</span>
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SlideOver open={modalIsOpen} setOpen={setModalIsOpen} content={modalContent} />
    </div>
  );
};

export default Devices;
