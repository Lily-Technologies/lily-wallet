import React from "react";
import styled from "styled-components";

import {
  green500,
  gray200,
  gray300,
  gray500,
  gray700,
} from "../../utils/colors";

import { SetStateString } from "../../types";

interface Props {
  currentTab: string;
  setCurrentTab: SetStateString;
}

const Tabs = ({ currentTab, setCurrentTab }: Props) => {
  return (
    <TabsContainer>
      <TabItem
        active={currentTab === "config"}
        onClick={() => setCurrentTab("config")}
      >
        Configuration
      </TabItem>
      <TabItem
        active={currentTab === "license"}
        onClick={() => setCurrentTab("license")}
      >
        License
      </TabItem>
      <TabItem
        active={currentTab === "network"}
        onClick={() => setCurrentTab("network")}
      >
        Network
      </TabItem>
      <TabItem
        active={currentTab === "about"}
        onClick={() => setCurrentTab("about")}
      >
        About
      </TabItem>
    </TabsContainer>
  );
};

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${gray200};
`;

const TabItem = styled.button<{ active: boolean }>`
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-bottom: 2px solid ${(p) => (p.active ? green500 : "none")};
  margin-left: 2rem;
  cursor: pointer;
  color: ${(p) => (p.active ? green500 : gray500)};
  font-weight: 600;
  text-decoration: none;

  &:nth-child(1) {
    margin-left: 0;
  }

  &:hover {
    border-bottom: 2px solid ${(p) => (p.active ? "none" : gray300)};
    color: ${(p) => (p.active ? "inherit" : gray700)};
  }
`;

export default Tabs;
