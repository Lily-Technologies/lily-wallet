import React, { useState, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { KeyboardArrowDown } from '@styled-icons/material';

import { NavLinks, Transition, Sidebar, Button } from '.';

import { white, darkGray, lightBlack, lightGray, gray600, black } from '../utils/colors';
import rem from '../utils/rem';
import { mobile } from '../utils/media';

const HEADER_HEIGHT = 125;

const Wrapper = styled.div`
  display: none;
  ${mobile(css`
    display: flex;
  `)}
`;

export const MobileNavbar = ({ config, setCurrentAccount, mobileNavOpen, setMobileNavOpen }) => {

  return (
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
            <NavLinks config={config} setCurrentAccount={setCurrentAccount} loading={false} />
          </SidebarContainer>
          <CloseButtonContainer>
            <CloseButton background="transparent" onClick={() => setMobileNavOpen(false)}>
              <SVGXImage viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </SVGXImage>
            </CloseButton>
          </CloseButtonContainer>
        </SomeContainer>
      </Transition>
    </Wrapper >
  );
};

const SidebarContainer = styled.div`
  position: relative;
  height: 100%;
  width: 12em;
  background: ${white};
  z-index: 100;
`;

const CloseButton = styled.button`
  ${Button}
`;

const CloseButtonContainer = styled.div`
  display: none;
  overflow: hidden;
  height: 100vh;
  z-index: 50;
  ${mobile(css`
    display: flex;
    // align-items: center;
    // justify-content: space-between;
    // height: ${rem(HEADER_HEIGHT)};
    // border-bottom: 1px solid ${darkGray};
    // background: ${white};
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
  background: ${gray600};
`;

export default MobileNavbar;