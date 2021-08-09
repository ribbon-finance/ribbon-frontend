import { useEffect } from "react";
import { useCallback } from "react";

import { VaultOptions } from "shared/lib/constants/constants";
import { initialVaultActionForm, useWebappGlobalState } from "../store/store";

const useVaultActionForm = (vaultOption: VaultOptions) => {
  const [vaultActionForm, setVaultActionForm] =
    useWebappGlobalState("vaultActionForm");

  /**
   * Utility for reset action form
   */
  const resetActionForm = useCallback(() => {
    setVaultActionForm({
      ...initialVaultActionForm,
      vaultOption,
    });
  }, [vaultOption, setVaultActionForm]);

  /**
   * Reset form when vault option changes
   */
  useEffect(() => {
    resetActionForm();
  }, [vaultOption, resetActionForm]);

  /**
   * Handle input amount changed
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      setVaultActionForm((actionForm) => ({
        ...actionForm,
        inputAmount: rawInput && parseFloat(rawInput) < 0 ? "" : rawInput,
      }));
    },
    [setVaultActionForm]
  );

  // TODO:
  const handleMaxClick = useCallback(() => {}, []);

  return {
    vaultActionForm,
    handleInputChange,
    handleMaxClick,
    resetActionForm,
  };
};

export default useVaultActionForm;
