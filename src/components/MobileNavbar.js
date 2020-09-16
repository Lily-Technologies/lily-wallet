import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { KeyboardArrowDown } from '@styled-icons/material';
import { networks } from 'bitcoinjs-lib';

import { NavLinks } from './NavLinks';

import { white, darkGray, lightBlack, lightGray } from '../utils/colors';
import rem from '../utils/rem';
import { mobile } from '../utils/media';
import { bitcoinNetworkEqual } from '../utils/transactions';

const HEADER_HEIGHT = 125;

const Wrapper = styled.div`
  display: none;
  ${mobile(css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${rem(HEADER_HEIGHT)};
    border-bottom: 1px solid ${darkGray};
    background: ${white};
  `)};
`;

const SecondaryMenu = styled.div`
  position: absolute;
  top: ${rem(HEADER_HEIGHT)};
  left: 0;
  right: 0;
  ${p =>
    p.isOpen
      ? css`
          height: ${rem(HEADER_HEIGHT)};
        `
      : css`
          height: 0;
        `} display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${rem(20)};
  transition: height 0.1s;
  user-select: none;
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll;
  overflow-y: hidden;
  color: ${darkGray};
  background: ${white};
  // border-bottom: 1px solid ${darkGray};
`;

const ArrowWrapper = styled.div`
  transition: transform 0.2s;
  ${p =>
    p.shouldRotate &&
    css`
      transform-origin: center center;
      transform: rotate(180deg);
    `};
`;

const StyledIcon = styled.div`
  && {
    width: ${p => rem(p.size || 20)};
    height: ${p => rem(p.size || 20)};
  }
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: .25em;
`;

const LilyImageGray = styled.img`
  width: 36px;
  height: 36px;
  margin-right: .25em;
  filter: grayscale(100%);
`;

const WalletsHeader = styled.h3`
  color: ${lightBlack};
  margin: 1.125em;
  font-size: 1.125em;
  font-weight: 100;
`;

const WalletTitle = styled(WalletsHeader)`
  display: flex;
  align-items: center;
  padding: 1.5em 1em;
  font-weight: 700;
  margin: 0;
  // border-bottom: 0.0625em solid ${lightGray};
`;

export const MobileNavbar = ({ config, setCurrentAccount, currentBitcoinNetwork }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      {/* {showSideNav !== false && (
        <div active={!isSideFolded} onClick={onSideToggle}>
          {isSideFolded ? <FoldIcon /> : <CloseIcon />}
        </div>
      )} */}

      <WalletTitle>
        { bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ?
          <LilyImageGray src={require('../assets/flower.svg')} /> :
          <LilyImage src={require('../assets/flower.svg')} />
        }
        Lily Wallet
        { bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) &&
            ' (testnet)'
        }
      </WalletTitle>
      <div>
        {/* <div onClick={onSearchButtonClick}>
          <StyledIcon as={Search} size={28} />
        </div> */}

        <div onClick={() => setIsOpen(!isOpen)} active={isOpen ? 1 : undefined}>
          <ArrowWrapper shouldRotate={isOpen}>
            <StyledIcon as={KeyboardArrowDown} size={36} />
          </ArrowWrapper>
        </div>
      </div>

      <SecondaryMenu isOpen={isOpen}>
        <NavLinks setIsOpen={setIsOpen} config={config} setCurrentAccount={setCurrentAccount} />
      </SecondaryMenu>
    </Wrapper>
  );
};

export default MobileNavbar;