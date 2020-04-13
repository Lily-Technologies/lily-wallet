import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";

import { offWhite } from './utils/colors';

// Pages
import SelectDevice from './pages/SelectDevice';
import Device from './pages/Device';
import Sign from './pages/Sign';
import XPub from './pages/XPub';

// Other display components
// import Header from './components/Nav/Header';
// import Footer from './components/footer';

function App() {
  const [device, setDevice] = useState();

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
          <Route path="/device" component={() => <Device device={device} />} />
          <Route path="/xpub" component={() => <XPub device={device} />} />
          <Route path="/sign" component={() => <Sign device={device} />} />
          <Route path="/" component={() => <SelectDevice device={device} setDevice={setDevice} />} />
        </Switch>
      </PageWrapper>
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

export default App;
