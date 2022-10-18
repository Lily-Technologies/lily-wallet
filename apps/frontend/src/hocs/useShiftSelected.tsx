import { ChangeEvent, useCallback, useState } from 'react';

/**
 * Note: Shift + Space doesn't work. You need to use something like this,
 *
 * ```
 * onKeyUp={(event) => {
 *   if (event.code === 'Space' && event.target.disabled) {
 *     onChange(event as any, member)
 *   }
 * }}
 * ```
 */
export const useShiftSelected = <P,>(
  initialState: Array<P>,
  change: (addOrRemove: boolean, items: Array<P>) => void
) => {
  const [initialStateModified, setInitialStateModified] = useState(initialState);
  const [previousSelected, setPreviousSelected] = useState<P | null>(null);
  const [previousChecked, setPreviousChecked] = useState<boolean>(false);
  const [currentSelected, setCurrentSelected] = useState<P | null>(null);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, item: P) => {
      // @ts-ignore shiftKey is defined for click events
      if (event.nativeEvent.shiftKey) {
        const current = initialStateModified.findIndex((x) => x === item);
        const previous = initialStateModified.findIndex((x) => x === previousSelected);
        const previousCurrent = initialStateModified.findIndex((x) => x === currentSelected);
        const start = Math.min(current, previous);
        const end = Math.max(current, previous);
        if (start > -1 && end > -1) {
          change(previousChecked, initialStateModified.slice(start, end + 1));
          if (previousCurrent > end) {
            change(!previousChecked, initialStateModified.slice(end + 1, previousCurrent + 1));
          }
          if (previousCurrent < start) {
            change(!previousChecked, initialStateModified.slice(previousCurrent, start));
          }
          setCurrentSelected(item);
          return;
        }
      } else {
        setPreviousSelected(item);
        setCurrentSelected(null);
        setPreviousChecked(event.target.checked);
      }
      change(event.target.checked, [item]);
    },
    [
      change,
      initialStateModified,
      previousSelected,
      setPreviousSelected,
      previousChecked,
      setPreviousChecked,
      currentSelected,
      setCurrentSelected
    ]
  );

  const resetShiftSelectSelections = useCallback(
    (sortedFilteredState) => {
      setInitialStateModified(sortedFilteredState);
      setCurrentSelected(null);
      setPreviousSelected(null);
      setPreviousChecked(false);
    },
    [
      change,
      initialStateModified,
      previousSelected,
      setPreviousSelected,
      previousChecked,
      setPreviousChecked,
      currentSelected,
      setCurrentSelected
    ]
  );

  return { onChange, resetShiftSelectSelections };
};
