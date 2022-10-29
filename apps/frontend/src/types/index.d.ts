import { AccountMap, LilyAccount, Transaction, AddressTag } from '@lily/types';
import { IpcRenderer } from 'electron';

declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      ipcRenderer: any;
      ipcMain: any;
    }
  }
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

// see https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

// Source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
// A more precise version of just React.ComponentPropsWithoutRef on its own
export type PropsOf<C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

type AsProp<C extends React.ElementType> = {
  /**
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  as?: C;
};

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
export type InheritableElementProps<C extends React.ElementType, Props = {}> = ExtendableProps<
  PropsOf<C>,
  Props
>;

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = InheritableElementProps<C, Props & AsProp<C>>;

// React Types
export type SetStateBoolean = React.Dispatch<React.SetStateAction<boolean>>;
export type SetStateString = React.Dispatch<React.SetStateAction<string>>;
export type SetStateNumber = React.Dispatch<React.SetStateAction<number>>;
export type SetStatePsbt = React.Dispatch<React.SetStateAction<Psbt>>;

export type AccountMapAction =
  | { type: 'ACCOUNTMAP_UPDATE'; payload: { account: LilyAccount } }
  | { type: 'ACCOUNTMAP_SET'; payload: AccountMap }
  | {
      type: 'ACCOUNT_ADDRESS_ADD_TAG';
      payload: { accountId: string; tag: AddressTag };
    }
  | {
      type: 'ACCOUNT_ADDRESS_DELETE_TAG';
      payload: { accountId: string; tag: AddressTag };
    }
  | {
      type: 'ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION';
      payload: { accountId: string; txid: string; description: string };
    };
