import React, { useState, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { KeyboardArrowDown } from '@styled-icons/material';
import { CloseOutline } from '@styled-icons/evaicons-outline';

import { NavLinks, Transition, Sidebar, Button, StyledIcon } from '.';

import { white, darkGray, lightBlack, lightGray, gray600, gray800, black } from '../utils/colors';
import rem from '../utils/rem';
import { mobile } from '../utils/media';
import { bitcoinNetworkEqual } from '../utils/transactions';

export const MobileNavbar = ({ config, setCurrentAccount, mobileNavOpen, setMobileNavOpen, currentBitcoinNetwork }) => (
  <Wrapper>
    <Transition
      show={mobileNavOpen}
      enter="transition ease-linear duration-300"
      enterFrom="transform opacity-0"
      enterTo="transform opacity-100"
      leave="transition ease-linear duration-300"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    >
      <BackgroundContainer onClick={() => setMobileNavOpen(false)}>
        <BackgroundOverlay></BackgroundOverlay>
      </BackgroundContainer>
    </Transition>

    <Transition
      show={mobileNavOpen}
      enter="transition ease-in-out duration-300 transform"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
    >
      <SomeContainer>
        <SidebarContainer>
          <NavLinks config={config} setCurrentAccount={setCurrentAccount} setMobileNavOpen={setMobileNavOpen} currentBitcoinNetwork={currentBitcoinNetwork} />
          <CloseButtonContainer>
            <CloseButton background="transparent" onClick={() => setMobileNavOpen(false)}>
              <StyledIcon as={CloseOutline} size={36} />
            </CloseButton>
          </CloseButtonContainer>
        </SidebarContainer>
      </SomeContainer>
    </Transition>
  </Wrapper>
);

const Wrapper = styled.div`
  display: none;
  ${mobile(css`
    display: flex;
  `)}
`;

const SidebarContainer = styled.div`
  position: relative;
  height: 100%;
  width: 12em;
  background: ${white};
  z-index: 100;
  padding-top: 1em;
`;

const CloseButton = styled.button`
  ${Button}
  width: 3rem;
  height: 3rem;
  padding: 0;
`;

const CloseButtonContainer = styled.div`
  display: none;
  overflow: hidden;
  // height: 100vh;
  z-index: 50;
  ${mobile(css`
    display: flex;
    margin-right: -3.5em;
    position: absolute;
    top: 0;
    right: 0;
    padding: .25rem;
  `)};
`;

const SVGXImage = styled.svg`
  width: 1.5em;
  height: 1.5em;
  color: ${black};
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  z-index: 40;
`;

const SomeContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  z-index: 40;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  opacity: 0.75;
  background: ${gray800};
`;

export default MobileNavbar;