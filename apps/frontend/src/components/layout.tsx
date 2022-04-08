// KBC-TODO: either apply throughout entire project or remove
// There are some components that implement this in their own files
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { MenuIcon } from '@heroicons/react/outline';
import FlowerLogo from 'src/assets/flower.svg';

import { mobile } from 'src/utils/media';
import { white, black } from 'src/utils/colors';

import { ConfigContext, SidebarContext } from 'src/context';

interface Props {
  children: React.ReactChild;
}

export const PageWrapper = ({ children }: Props) => {
  const { setSidebarOpen } = useContext(SidebarContext);
  const { config } = useContext(ConfigContext);
  return (
    <div className='md:pl-64 flex flex-col flex-1 h-full'>
      {/* sticky mobile nav */}
      {process.env.REACT_APP_IS_ELECTRON ? null : (
        <div className='sticky top-0 z-20 md:hidden pl-1 sm:pl-3 bg-green-900 border-b border-gray-800'>
          <div className='relative h-16 flex items-center justify-between lg:border-b lg:border-sky-800'>
            <Link to='/' className='px-2 flex items-center lg:px-0'>
              <div className='flex-shrink-0'>
                <img className='block h-8 w-auto' src={FlowerLogo} alt='Lily logo' />
              </div>
              <span className='text-white ml-2 mt-1 font-medium'>Lily Wallet</span>
            </Link>
            <button
              type='button'
              className='-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <MenuIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
        </div>
      )}
      <main className='flex-1 z-10 dark:bg-gray-900 bg-gray-100 relative'>
        <ColorOverlap className='bg-green-700 dark:bg-green-900' style={{ zIndex: '-1' }} />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-8'>{children}</div>
      </main>
    </div>
  );
};

const ColorOverlap = styled.div`
  background-image: ${`url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%2338a169' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E")`};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 19em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  ${mobile(css`
    height: 20em;
  `)}
`;

const Wrapper = styled.div`
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  display: flex;
  flex: 1;
  display: flex;
  min-height: 400px;
  flex-direction: column;
  align-items: center;
  padding: 0em 3em;
  overflow: hidden;
  z-index: 1;

  ${mobile(css`
    padding: 0em 1em;
  `)};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.25em 2em;
  overflow: auto;
  flex: 1;
  max-width: 75rem;
  width: 100%;

  ${mobile(css`
    padding: 2.25em 0em;
  `)};
`;

export const PageTitle = styled.div`
  font-size: 2em;
  color: ${white};
  font-weight: 600;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  flex-wrap: wrap;
  color: ${white};
`;
export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
export const HeaderRight = styled.div`
  display: flex;
`;
