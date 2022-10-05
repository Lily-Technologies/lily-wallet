import React, { Fragment } from 'react';
import styled from 'styled-components';

import { green800, white, gray700 } from 'src/utils/colors';

interface Props {
  mnemonicWords: string;
}

export const MnemonicWordsDisplayer = ({ mnemonicWords }: Props) => {
  const mnemonicWordsArray = mnemonicWords.split(' ');

  return (
    <Fragment>
      <div className='flex flex-col'>
        {mnemonicWordsArray.slice(0, 6).map((word, index) => (
          <div
            key={index}
            className='bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 py-4 px-6 border border-green-800 relative text-center rounded-2xl m-1'
          >
            <span className='absolute top-1 left-1 text-xs text-slate-600 dark:text-slate-300'>
              ({index + 1})
            </span>
            {word}
          </div>
        ))}
      </div>
      <div className='flex flex-col'>
        {mnemonicWordsArray.slice(6, 12).map((word, index) => (
          <div
            key={index + 6}
            className='bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 py-4 px-6 border border-green-800 relative text-center rounded-2xl m-1'
          >
            <span className='absolute top-1 left-1 text-xs text-slate-600 dark:text-slate-300'>
              ({index + 7}){' '}
            </span>
            {word}
          </div>
        ))}
      </div>
      <div className='flex flex-col'>
        {mnemonicWordsArray.slice(12, 18).map((word, index) => (
          <div
            key={index + 12}
            className='bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 py-4 px-6 border border-green-800 relative text-center rounded-2xl m-1'
          >
            <span className='absolute top-1 left-1 text-xs text-slate-600 dark:text-slate-300'>
              ({index + 13})
            </span>
            {word}
          </div>
        ))}
      </div>
      <div className='flex flex-col'>
        {mnemonicWordsArray.slice(18, 24).map((word, index) => (
          <div
            key={index + 18}
            className='bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 py-4 px-6 border border-green-800 relative text-center rounded-2xl m-1'
          >
            <span className='absolute top-1 left-1 text-xs text-slate-600 dark:text-slate-300'>
              ({index + 19})
            </span>
            {word}
          </div>
        ))}
      </div>
    </Fragment>
  );
};

const Word = styled.div`
  padding: 1.25em;
  margin: 0.25em;
  background: ${white};
  border: 1px solid ${green800};
  border-radius: 4px;
  position: relative;
  text-align: center;
`;

const WordIndex = styled.span`
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 0.5em;
  color: ${gray700};
`;
