import React from 'react';
import { Transition } from '@headlessui/react';

interface Props {
  appear?: boolean;
  show: boolean;
  children: JSX.Element;
  className?: string;
}

const TransitionSlideLeft = ({ appear = true, show, children, className }: Props) => {
  return (
    <Transition
      className={className}
      show={show}
      appear={appear}
      enter='transform transition-all duration-300 delay-300 ease-in-out'
      enterFrom='translate-x-1/4 opacity-0'
      enterTo='translate-x-0 opacity-100'
      leave='transform transition-all duration-300 ease-in-out'
      leaveFrom='translate-x-0 opacity-100'
      leaveTo='-translate-x-1/4 opacity-0'
    >
      {children}
    </Transition>
  );
};

export default TransitionSlideLeft;
