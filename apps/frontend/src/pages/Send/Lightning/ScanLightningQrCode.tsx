import React, { useRef, useState } from 'react';
import QrReader from 'react-qr-reader';
import { UploadIcon } from '@heroicons/react/solid';

import DeadFlowerImage from 'src/assets/dead-flower.svg';
interface Props {
  onSuccess: (qrData: string) => void;
}

const ScanLightningQrCode = ({ onSuccess }: Props) => {
  const [legacyMode, setLogacyMode] = useState(true);
  const [error, setError] = useState('');
  const qrReaderRef = useRef(null);

  const handleLoad = () => {};

  const readQrData = (data: string) => {
    onSuccess(data);
  };

  const handleError = (err) => {
    console.log('err: ', err);
    setLogacyMode(true);
  };

  const onImageLoad = (arg) => {
    setError('Could not read image QR');
  };

  if (legacyMode) {
    return (
      <div className='px-4 pt-6 pb-5 text-center space-y-4'>
        <h2 className='text-2xl font-semibold text-gray-600 dark:text-gray-200'>Bummer!</h2>
        <img src={DeadFlowerImage} className='w-1/4 mx-auto' />
        <p className='w-full md:w-2/3 text-gray-900 dark:text-gray-200 mx-auto text-sm'>
          Your browser doesn't support directly accessing your camera.
          <br />
          However, you can use a photo of the QR code to pay an invoice.
        </p>
        <div>
          <QrReader
            className='qr-image-wrapper'
            ref={qrReaderRef}
            style={{ width: '100%', display: legacyMode ? 'none' : 'block' }}
            onLoad={handleLoad}
            onError={handleError}
            legacyMode={legacyMode}
            onImageLoad={onImageLoad}
            onScan={(data) => {
              if (data) readQrData(data);
              else return;
            }}
          />
        </div>
        {error ? <p className='text-sm text-red-500'>{error}</p> : null}
        <button
          type='button'
          className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
          onClick={() => {
            // @ts-ignore
            qrReaderRef.current!.openImageDialog();
          }}
        >
          <UploadIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
          Select photo
        </button>
      </div>
    );
  }

  return (
    <QrReader
      className='qr-image-wrapper'
      style={{ width: '100%' }}
      onLoad={handleLoad}
      onError={handleError}
      onImageLoad={onImageLoad}
      onScan={(data) => {
        if (data) readQrData(data);
        else return;
      }}
    />
  );
};

export default ScanLightningQrCode;
