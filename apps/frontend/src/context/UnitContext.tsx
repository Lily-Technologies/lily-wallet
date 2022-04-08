import React, { createContext, useState } from 'react';
import { satoshisToBitcoins } from 'unchained-bitcoin';

type UnitOptions = 'BTC' | 'sats';

interface ContextProps {
  setUnit: (unit: UnitOptions) => void;
  unit: UnitOptions;
  toggleUnit: () => void;
  getValue: (value: number) => string;
}

export const UnitContext = createContext({} as ContextProps);

export const UnitProvider = ({ children }: { children: React.ReactChild }) => {
  const [unit, setUnit] = useState<UnitOptions>('BTC');

  const toggleUnit = () => {
    if (unit === 'BTC') setUnit('sats');
    else setUnit('BTC');
  };

  const getValue = (value: number) => {
    if (unit === 'BTC') {
      return `${satoshisToBitcoins(value).toFixed()} BTC`;
    } else {
      return `${value.toLocaleString()} sat${value === 1 ? '' : 's'}`; // if 1 sat, don't add "s"
    }
  };

  const value = {
    unit,
    setUnit,
    toggleUnit,
    getValue
  };

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};
