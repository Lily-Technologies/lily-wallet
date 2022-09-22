import React, { createContext, useState } from 'react';
import { satoshisToBitcoins } from 'unchained-bitcoin';

import { useLocalStorage } from 'src/utils/useLocalStorage';

type UnitOptions = 'BTC' | 'sats';

interface ContextProps {
  setUnit: (unit: UnitOptions) => void;
  unit: UnitOptions;
  toggleUnit: () => void;
  getValue: (value: number) => string;
}

export const UnitContext = createContext({} as ContextProps);

export const UnitProvider = ({ children }: { children: React.ReactChild }) => {
  const [currencyUnit, setCurrencyUnit] = useLocalStorage<UnitOptions>('currencyUnit', 'BTC');
  const [unit, setUnit] = useState<UnitOptions>(currencyUnit);

  const toggleUnit = () => {
    if (unit === 'BTC') {
      setUnit('sats');
      setCurrencyUnit('sats');
    } else {
      setUnit('BTC');
      setCurrencyUnit('BTC');
    }
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
