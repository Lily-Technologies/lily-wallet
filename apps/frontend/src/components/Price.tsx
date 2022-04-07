import React, { useContext } from 'react';
import { ConfigContext } from 'src/context';
import { satoshisToBitcoins } from 'unchained-bitcoin';

interface Props {
  value: number;
  className?: string;
}

export const Price = ({ value, className }: Props) => {
  const { currentBitcoinPrice } = useContext(ConfigContext);

  const getPrice = (value: number) =>
    satoshisToBitcoins(value).multipliedBy(currentBitcoinPrice).toFixed(2);

  return <span className={className}>${getPrice(value)}</span>;
};
