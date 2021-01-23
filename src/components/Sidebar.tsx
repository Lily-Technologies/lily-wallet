import React, { Fragment } from "react";
import styled, { css } from "styled-components";
import { useSpring, animated } from "react-spring";
import { Network } from "bitcoinjs-lib";

import { NavLinks } from "./NavLinks";

import { white, darkOffWhite } from "../utils/colors";
import { mobile } from "../utils/media";

import { LilyConfig } from "../types";

interface Props {
  config: LilyConfig;
  flyInAnimation: boolean;
  currentBitcoinNetwork: Network;
}

export const Sidebar = ({
  config,
  flyInAnimation,
  currentBitcoinNetwork,
}: Props) => {
  const sidebarAnimationProps = useSpring({
    transform: flyInAnimation ? "translateX(-120%)" : "translateX(0%)",
  });

  return (
    <Fragment>
      <SidebarPlaceholder></SidebarPlaceholder>
      <SidebarWrapperAnimated style={{ ...sidebarAnimationProps }}>
        <SidebarContainer>
          <NavLinks
            config={config}
            currentBitcoinNetwork={currentBitcoinNetwork}
          />
        </SidebarContainer>
      </SidebarWrapperAnimated>
    </Fragment>
  );
};

const SidebarPlaceholder = styled.div`
  width: 12em;
`;

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 12em;
  // min-height: 100vh;
  border: solid 1px ${darkOffWhite};
  border-left: none;
  height: 100vh;
  position: fixed;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  ${mobile(css`
    flex-direction: row;
    display: none;
    height: auto;
  `)};
`;

const SidebarWrapperAnimated = animated(SidebarWrapper);

const SidebarContainer = styled.div`
  position: fixed;
  height: 100%;
  width: 12em;
  background: ${white};
  overflow: auto;
  padding-bottom: 4em;
`;
