import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import BigNumber from 'bignumber.js';

import { PageWrapper } from '../../components';

import { AccountsSection } from './AccountsSection';
import { HistoricChart } from './HistoricChart';

const Home = ({ historicalBitcoinPrice, currentBitcoinPrice, flyInAnimation, prevFlyInAnimation }: { historicalBitcoinPrice: any, currentBitcoinPrice: BigNumber, flyInAnimation: boolean, prevFlyInAnimation: boolean }) => {
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    if (flyInAnimation !== prevFlyInAnimation) { // if these values are different, change local
      setInitialLoad(true)
    }
  }, [flyInAnimation, prevFlyInAnimation]);

  const chartProps = useSpring({ transform: initialLoad || (flyInAnimation === false && prevFlyInAnimation === false) ? 'translateY(0%)' : 'translateY(-120%)' });
  const accountsProps = useSpring({ transform: initialLoad || (flyInAnimation === false && prevFlyInAnimation === false) ? 'translateY(0%)' : 'translateY(120%)' });

  return (
    <PageWrapper>
      <animated.div style={{ ...chartProps }}>
        <HistoricChart historicalBitcoinPrice={historicalBitcoinPrice} currentBitcoinPrice={currentBitcoinPrice} />
      </animated.div>

      <animated.div style={{ ...accountsProps }}>
        <AccountsSection />
      </animated.div>
    </PageWrapper >
  )
};

export default Home