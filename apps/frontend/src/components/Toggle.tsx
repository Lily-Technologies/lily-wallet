import React, { useContext, useState } from 'react';
import { Switch } from '@headlessui/react';

import { UnitContext } from 'src/context';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function CurrencyToggle() {
  const { unit, toggleUnit } = useContext(UnitContext);

  const enabled = unit === 'sats';
  return (
    <Switch
      checked={enabled}
      onChange={toggleUnit}
      className='bg-slate-200 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative inline-flex items-center h-7 w-28 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
    >
      <span className='sr-only'>Use setting</span>
      <span
        className={classNames(
          enabled ? 'translate-x-[3.4rem]' : 'translate-x-0',
          'pointer-events-none relative inline-block h-6 w-14 transform rounded-full bg-green-500 shadow ring-0 transition duration-200 ease-in-out'
        )}
      ></span>
      <div className='absolute inset-0 flex justify-between items-center px-3'>
        <span
          className={classNames(
            enabled ? 'dark:text-slate-400' : 'font-semibold text-gray-100 dark:text-white',
            ''
          )}
        >
          BTC
        </span>
        <span
          className={classNames(
            enabled
              ? 'font-semibold text-gray-100 dark:text-white'
              : 'dark:text-slate-400 text-slate-700',
            ''
          )}
        >
          Sats
        </span>
      </div>
    </Switch>
  );
}
