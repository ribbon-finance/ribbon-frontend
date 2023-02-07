import React, { useEffect } from "react";
import styled from "styled-components";
import smoothscroll from "smoothscroll-polyfill";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3DataContextProvider } from "./hooks/web3DataContext";
import "shared/lib/i18n/config";
import { Web3ContextProvider } from "./hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { SubgraphDataContextProvider } from "./hooks/subgraphDataContext";
import { PendingTransactionsContextProvider } from "./hooks/pendingTransactionsContext";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { ChainContextProvider } from "./hooks/chainContext";
import { GeofenceCountry, useGeofence } from "shared/lib/hooks/useGeofence";
import TextPreview from "shared/lib/components/TextPreview/TextPreview";
import Geoblocked from "shared/lib/components/Geoblocked/Geoblocked";
import { LoadingText } from "shared/lib/hooks/useLoadingText";
import RootApp from "./pages/RootApp";
import colors from "shared/lib/designSystem/colors";
import "shared/lib/i18n/config";

const Body = styled.div`
  background-color: ${colors.background.one};
  display: flex;
  width: 100vw;
  height: 100vh;
`;

function App() {
  const { loading, rejected } = useGeofence(GeofenceCountry.SINGAPORE);
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  if (loading) {
    return (
      <TextPreview>
        <LoadingText>Ribbon Lend</LoadingText>
      </TextPreview>
    );
  } else if (!loading && rejected) {
    return (
      <Body>
        <Geoblocked />
      </Body>
    );
  }

  return (
    <ChainContextProvider>
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
    </ChainContextProvider>
  );
}
export default App;
