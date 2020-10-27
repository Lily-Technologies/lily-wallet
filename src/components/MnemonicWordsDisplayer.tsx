import React, { Fragment } from 'react';
import styled from 'styled-components';

import { green800, white, darkGray } from '../utils/colors';

interface Props {
  mnemonicWords: string
}

export const MnemonicWordsDisplayer = ({ mnemonicWords }: Props) => {
  const mnemonicWordsArray = mnemonicWords.split(" ");

  return (
    <Fragment>
      <WordSection>
        {mnemonicWordsArray.slice(0, 6).map((word, index) => (
          <Word key={index}>
            <WordIndex>({index + 1})</WordIndex>
            {word}
          </Word>
        ))}
      </WordSection>
      <WordSection>
        {mnemonicWordsArray.slice(6, 12).map((word, index) => (
          <Word key={index + 6}>
            <WordIndex>({index + 7}) </WordIndex>
            {word}
          </Word>
        ))}
      </WordSection>
      <WordSection>
        {mnemonicWordsArray.slice(12, 18).map((word, index) => (
          <Word key={index + 12}>
            <WordIndex>({index + 13})</WordIndex>
            {word}
          </Word>
        ))}
      </WordSection>
      <WordSection>
        {mnemonicWordsArray.slice(18, 24).map((word, index) => (
          <Word key={index + 18}>
            <WordIndex>({index + 19})</WordIndex>
            {word}
          </Word>
        ))}
      </WordSection>
    </Fragment>
  )
}

const WordSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Word = styled.div`
  padding: 1.25em;
  margin: .25em;
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
  font-size: .5em;
  color: ${darkGray};
`;