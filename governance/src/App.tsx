import { Web3ReactProvider } from "@web3-react/core";
import React, { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import "shared/lib/i18n/config";

import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";
import { PendingTransactionsContextProvider } from "shared/lib/hooks/pendingTransactionsContext";
import { ChainContextProvider } from "shared/lib/hooks/chainContext";
import { getSolanaClusterURI } from "shared/lib/utils/env";
import { GeofenceCountry, useGeofence } from "shared/lib/hooks/useGeofence";
import TextPreview from "shared/lib/components/TextPreview/TextPreview";
import { LoadingText } from "shared/lib/hooks/useLoadingText";
import "shared/lib/i18n/config";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const { loading, rejected } = useGeofence(GeofenceCountry.SINGAPORE);
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  if (loading) {
    return (
      <TextPreview>
        <LoadingText>Ribbon Finance Governance</LoadingText>
      </TextPreview>
    );
  } else if (!loading && rejected) {
    return (
      <TextPreview>
        {t("shared:GeoblockWarning:title")}
        <br />
        {t("shared:GeoblockWarning:visit")}{" "}
        <a href={t("shared:GeoblockWarning:url")}>
          {t("shared:GeoblockWarning:termsAndConditions")}
        </a>{" "}
        {t("shared:GeoblockWarning:forMoreDetails")}.
      </TextPreview>
    );
  }

  return (
    <ChainContextProvider>
      <ConnectionProvider endpoint={getSolanaClusterURI()}>
        <Web3ContextProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <PendingTransactionsContextProvider>
              <Web3DataContextProvider>
                <SubgraphDataContextProvider>
                  <ExternalAPIDataContextProvider>
                    <RootApp />
                  </ExternalAPIDataContextProvider>
                </SubgraphDataContextProvider>
              </Web3DataContextProvider>
            </PendingTransactionsContextProvider>
          </Web3ReactProvider>
        </Web3ContextProvider>
      </ConnectionProvider>
    </ChainContextProvider>
  );
}

export default App;
