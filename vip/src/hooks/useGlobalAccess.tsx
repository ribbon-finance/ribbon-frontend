import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useGlobalAccessState, useWebappGlobalState } from "../store/store";
import { hashCode, VIPVaultOptions } from "../constants/constants";
import { useHistory } from "react-router-dom";
import { VaultName, VaultNameOptionMap } from "shared/lib/constants/constants";
import { useStorage } from "./useStorageContextProvider";

const useGlobalAccess = () => {
  const history = useHistory();
  const [globalAccess, setGlobalAccess] = useGlobalAccessState("access");
  const [, setAccessModal] = useWebappGlobalState("isAccessModalVisible");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [, setStorage] = useStorage();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      setCode(rawInput);
    },
    [setCode]
  );

  const handleSubmission = useCallback(() => {
    const hex = ethers.utils.formatBytes32String(code.toUpperCase());
    const hash = ethers.utils.sha256(hex);

    let vault: VIPVaultOptions | undefined;
    for (const [key, value] of Object.entries(hashCode)) {
      if (value === hash) {
        vault = key as VIPVaultOptions;
      }
    }

    if (vault) {
      setGlobalAccess((accessState) => {
        if (!accessState.includes(vault as VIPVaultOptions)) {
          localStorage.setItem(
            "auth",
            JSON.stringify([...accessState, vault as VIPVaultOptions])
          );
          setStorage(localStorage.getItem("auth"));
          return [...accessState, vault as VIPVaultOptions];
        } else {
          return accessState;
        }
      });
      setError("");

      let vaultName;

      Object.keys(VaultNameOptionMap).filter((name) => {
        if (VaultNameOptionMap[name as VaultName] === vault) {
          vaultName = name;
        }
        return null;
      });

      history.push("/vip/" + vaultName);
      setAccessModal(false);
    } else {
      setError("Invalid Code");
    }
  }, [setError, code, history, setGlobalAccess, setAccessModal]);

  return {
    handleInputChange,
    handleSubmission,
    error,
    code,
    globalAccess,
  };
};

export default useGlobalAccess;
