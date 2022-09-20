import { Transition } from '@headlessui/react';

interface Props {
  appear?: boolean;
  show: boolean;
  children: JSX.Element;
  className?: string;
  afterLeave?: () => void;
}

export const InnerTransition = ({
  appear = true,
  show,
  children,
  className,
  afterLeave
}: Props) => {
  return (
    <Transition.Root
      className={className}
      show={show}
      appear={appear}
      enter='transform transition-all duration-300 delay-300 ease-in-out'
      enterFrom='translate-x-8 opacity-0'
      enterTo='translate-x-0 opacity-100'
      leave='transform transition-all duration-200 ease-in-out'
      leaveFrom='translate-x-0 opacity-100'
      leaveTo='-translate-x-8 opacity-0'
      afterLeave={afterLeave}
    >
      {children}
    </Transition.Root>
  );
};
