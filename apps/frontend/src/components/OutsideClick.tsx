import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: React.MutableRefObject<null>, onOutsideClick: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        onOutsideClick()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onOutsideClick]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter({ onOutsideClick, children }: { onOutsideClick: () => void, children: React.ReactChild }) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, onOutsideClick);

  return <div ref={wrapperRef}>{children}</div>;
}

export default OutsideAlerter;