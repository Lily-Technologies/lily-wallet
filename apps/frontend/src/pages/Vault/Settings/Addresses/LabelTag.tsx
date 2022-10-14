import { useContext } from 'react';
import { PlatformContext } from 'src/context';
import { AddressLabel } from '@lily/types';

interface Props {
  label: AddressLabel;
  deleteLabel?: (id: number) => void;
}

export const LabelTag = ({ label, deleteLabel }: Props) => {
  return (
    <span className='inline-flex whitespace-nowrap items-center rounded-full bg-slate-100 py-0.5 px-2 text-sm font-medium text-slate-700'>
      {label.label}
      {deleteLabel ? (
        <button
          type='button'
          className='cursor-pointer ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-500 focus:bg-slate-500 focus:text-white focus:outline-none'
          onClick={() => {
            deleteLabel(label.id);
          }}
        >
          <span className='sr-only'>Remove {label.label} label</span>
          <svg className='h-2 w-2' stroke='currentColor' fill='none' viewBox='0 0 8 8'>
            <path strokeLinecap='round' strokeWidth='1.5' d='M1 1l6 6m0-6L1 7' />
          </svg>
        </button>
      ) : null}
    </span>
  );
};
