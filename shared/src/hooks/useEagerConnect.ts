import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injectedConnector, ledgerConnector } from "../utils/connectors";
import { addConnectEvent } from "../utils/analytics";
import { isLedgerDappBrowserProvider } from "web3-ledgerhq-frame-connector";

const useEagerConnect = () => {
  const { activate, active, account } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (tried) {
      return;
    }

    // If is ledger dapp, use ledger connector. Else use injected connector
    if (isLedgerDappBrowserProvider()) {
      activate(ledgerConnector, undefined, true).catch(() => {
        setTried(true);
      });
    } else {
      injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injectedConnector, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
  }, [activate, tried]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      if (account) {
        addConnectEvent("background", account);
      }
      setTried(true);
    }
  }, [tried, active, activate, account]);

  return tried;
};
export default useEagerConnect;
