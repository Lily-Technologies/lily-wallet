import React, { useContext, useEffect, useState } from 'react';
import { bitcoinsToSatoshis, satoshisToBitcoins } from 'unchained-bitcoin';

import { Input, InputProps } from 'src/components';

import { UnitContext } from 'src/context';

// Note: `value` is always in satoshis
export const UnitInput = ({
  onChange,
  value,
  ...props
}: Omit<InputProps, 'type' | 'placeholder'>) => {
  const { unit } = useContext(UnitContext);
  const [modifiedValue, setModifiedValue] = useState('');

  useEffect(() => {
    if (unit === 'BTC') {
      setModifiedValue(satoshisToBitcoins(value).toPrecision());
    } else {
      setModifiedValue(bitcoinsToSatoshis(value).toPrecision());
    }
  }, [unit]);

  // We hold and display the modified value in this state but
  // call the parent onChange with the value in satoshis
  const onChangeOverride = (value: string) => {
    if (unit === 'BTC') {
      setModifiedValue(value);
      onChange(bitcoinsToSatoshis(value).toPrecision());
    } else {
      setModifiedValue(value);
      onChange(value);
    }
  };

  return (
    <Input
      onChange={onChangeOverride}
      value={modifiedValue}
      inputStaticText={unit}
      inputMode='decimal' // TODO: make dynamic based on `unit` value
      type='number'
      placeholder={unit === 'BTC' ? '6.15' : '615000000'}
      {...props}
    />
  );
};
