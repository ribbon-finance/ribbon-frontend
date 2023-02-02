import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useGlobalAccessState, useWebappGlobalState } from "../store/store";
import { useHistory } from "react-router-dom";
import { useStorage } from "./useStorageContextProvider";
import { useAirtableVIPData } from "shared/lib/hooks/useAirtableVIPData";
const useGlobalAccess = () => {
  const history = useHistory();
  const [globalAccess, setGlobalAccess] = useGlobalAccessState("access");
  const [, setAccessModal] = useWebappGlobalState("isAccessModalVisible");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [, setStorage] = useStorage();

  const { loading, vipMap } = useAirtableVIPData();

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

    let userAddress: string | undefined;
    // for (const [key, value] of Object.entries(hashCode)) {
    //   if (value === hash) {
    //     userAddress = key as string;
    //   }
    // }
    for (const [key, value] of Object.entries(vipMap)) {
      if (value.passcodeHash === hash) {
        userAddress = key as string;
      }
    }

    if (userAddress && !loading) {
      setGlobalAccess((accessState) => {
        if (!accessState.includes(userAddress as string)) {
          localStorage.setItem(
            "auth",
            JSON.stringify([...accessState, userAddress as string])
          );
          setStorage(localStorage.getItem("auth"));
          return [...accessState, userAddress as string];
        } else {
          return accessState;
        }
      });
      setError("");

      history.push("/vip/");
      setAccessModal(false);
    } else {
      setError("Invalid Code");
    }
  }, [
    code,
    loading,
    vipMap,
    setGlobalAccess,
    history,
    setAccessModal,
    setStorage,
  ]);

  return {
    handleInputChange,
    handleSubmission,
    error,
    code,
    globalAccess,
  };
};

export default useGlobalAccess;
