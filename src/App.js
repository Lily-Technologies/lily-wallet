import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";

import { offWhite, black, gray } from './utils/colors';

// Pages
import MainMenu from './pages/MainMenu';
import Setup from './pages/Setup';
import Spend from './pages/Spend';

// Other display components
// import Header from './components/Nav/Header';
// import Footer from './components/footer';

function App() {

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  return (
    <Router>
      {/* <WindowWrapper> */}
      {/* <Header /> */}
      <PageWrapper id="page-wrapper">
        <ScrollToTop />
        <Switch>
          {/* <Route path="/select-device" component={() => <SelectDevice device={device} setDevice={setDevice} />} /> */} */}
          <Route path="/setup" component={() => <Setup />} />
          <Route path="/send" component={() => <Spend />} />
          <Route path="/" component={() => <MainMenu />} />
        </Switch>
      </PageWrapper>
      <FooterWrapper>
        <ViewSourceCodeText href="https://github.com/KayBeSee/cc-kitchen-frontend" target="_blank">View Source Code</ViewSourceCodeText>
        <DontTrustVerify>Don't Trust. Verify.</DontTrustVerify>
      </FooterWrapper>
      {/* <Footer /> */}
      {/* </WindowWrapper> */}
    </Router>
  );
}

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Raleway', sans-serif;
  flex: 1;
  background: ${offWhite};
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${offWhite};
  flex: 1 0 250px;
`;

const ViewSourceCodeText = styled.a`
  color: ${ black};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: -0.03em;
  font-family: 'Raleway', sans-serif;
`;

const DontTrustVerify = styled.span`
color: ${ gray};
`;

export default App;
