import React, { useContext } from 'react';

import { UnitContext } from 'src/context';

interface Props {
  value: number;
  className?: string;
}

// all values throughout the application should be denominated in satoshis
export const Unit = ({ value, className }: Props) => {
  const { getValue } = useContext(UnitContext);

  return <span className={className}>{getValue(value)}</span>;
};
