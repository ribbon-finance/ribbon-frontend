import { useCallback, useEffect, useState } from "react";
import { isAddress } from "ethers/lib/utils";
import axios from "axios";
import { getENSSubgraphURI, isDevelopment } from "../utils/env";
import { useWeb3Context } from "./web3Context";
import { Provider } from "ethers/node_modules/@ethersproject/providers";

export interface ENSSearchResult {
  address: string;
  // This refers to the full name with .eth
  name?: string;
  // Short name without .eth
  labelName?: string;
  avatar?: string;
  texts: string[];
}

const useENSSearch = (searchString: string) => {
  const { provider } = useWeb3Context();

  const [result, setResult] = useState<ENSSearchResult>();
  const [loading, setLoading] = useState(false);
  const [, setCounter] = useState(0);

  const searchResult = useCallback(
    async (_provider: Provider, _searchString: string) => {
      /**
       * Kovan does not support ENS
       */
      if (isDevelopment()) {
        setResult(
          isAddress(_searchString)
            ? { address: _searchString, texts: [] }
            : undefined
        );
        return;
      }

      setLoading(true);

      /**
       * First, we set counter. This keep track if we are searching the latest data
       */
      let currentCount: number;
      setCounter((prev) => {
        currentCount = prev + 1;

        /**
         * Set address or refresh result on search string change before doing the search
         */
        setResult(
          isAddress(_searchString)
            ? { address: _searchString, texts: [] }
            : undefined
        );

        return prev + 1;
      });

      /**
       * If search keyword is address, we perform reverse search instead
       */
      const data = await fetchSearchFromENSSubgraph(
        isAddress(_searchString)
          ? (await _provider.lookupAddress(_searchString)) || ""
          : _searchString
      );

      setCounter((prev) => {
        if (prev === currentCount) {
          /**
           * If no result, we merely either set result to empty or set address
           */
          if (data.length <= 0) {
            setResult(
              isAddress(_searchString)
                ? { address: _searchString, texts: [] }
                : undefined
            );
          } else {
            const firstResult = data[0];
            setResult({
              address: firstResult.owner.id,
              name: firstResult.name,
              labelName: firstResult.labelName,
              texts: firstResult.resolver.texts || [],
            });
          }

          setLoading(false);
        }

        return prev;
      });
    },
    []
  );

  useEffect(() => {
    searchResult(provider, searchString);
  }, [provider, searchResult, searchString]);

  /**
   * Fetch avatar
   */
  useEffect(() => {
    (async () => {
      if (
        result &&
        result.name &&
        result.texts.includes("avatar") &&
        !result.avatar
      ) {
        const resolver = await provider.getResolver(result.name);

        if (!resolver) {
          return;
        }

        const avatarURL = await resolver.getText("avatar");

        setResult((prev) =>
          prev
            ? {
                ...prev,
                avatar: avatarURL,
              }
            : undefined
        );
      }
    })();
  }, [provider, result]);

  return { data: result, loading: loading };
};

const fetchSearchFromENSSubgraph = async (searchString: string) => {
  const response = await axios.post(getENSSubgraphURI(), {
    query: `{
      domains(
        where: {name: "${searchString}"}
      ){
        name
        labelName
        resolver {
          texts
        }
        owner {
          id
        }
      }
    }`,
  });

  return response.data.data.domains;
};

export default useENSSearch;
