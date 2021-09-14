import React, { useContext } from "react";
import { LilyLightningAccount } from "src/types";
import { AccountMapContext } from "../AccountMapContext";
import { ConfigContext } from "../ConfigContext";

interface RequireLightningProps {
  currentAccount: LilyLightningAccount;
}

export function requireLightning<
  T extends RequireLightningProps = RequireLightningProps
>(WrappedComponent: React.ComponentType<T>) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithLightningAccount = (
    props: Omit<T, keyof RequireLightningProps>
  ) => {
    const { currentAccount, setCurrentAccountId } =
      useContext(AccountMapContext);
    const { config } = useContext(ConfigContext);
    if (currentAccount.config.type !== "lightning" && !!config.lightning[0]) {
      setCurrentAccountId(config.lightning[0].id);
    }

    return <WrappedComponent {...{ currentAccount }} {...(props as T)} />;
  };

  ComponentWithLightningAccount.displayName = `requireLightning(${displayName})`;

  return ComponentWithLightningAccount;
}
