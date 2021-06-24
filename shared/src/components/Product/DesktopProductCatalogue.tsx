import { AnimatePresence, motion } from "framer";
import React, { useMemo, useState } from "react";
import { VaultOptions } from "../../constants/constants";
import { VaultAccount } from "../../models/vault";
import DesktopProductCatalogueGalleryView from "./DesktopProductCatalogueGalleryView";
import ProductCatalogueGridView from "./ProductCatalogueGridView";
import {
  DesktopViewType,
  ProductCatalogueProps,
  VaultFilterProps,
} from "./types";

interface DesktopProductCatalogueProps {
  filteredProducts: VaultOptions[];
  vaultAccounts: {
    [key: string]: VaultAccount | undefined;
  };
}

const DesktopProductCatalogue: React.FC<
  ProductCatalogueProps & VaultFilterProps & DesktopProductCatalogueProps
> = ({ variant, ...props }) => {
  const [view, setView] = useState<DesktopViewType>("grid");

  const body = useMemo(() => {
    if (variant === "landing") {
      return (
        <DesktopProductCatalogueGalleryView
          variant={variant}
          setView={setView}
          {...props}
        />
      );
    }

    switch (view) {
      case "grid":
        return (
          <ProductCatalogueGridView
            setView={setView}
            {...props}
            variant="desktop"
          />
        );
      case "gallery":
        return (
          <DesktopProductCatalogueGalleryView
            variant={variant}
            setView={setView}
            {...props}
          />
        );
    }
  }, [props, variant, view]);

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div
        key={view}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
          type: "keyframes",
          ease: "easeOut",
        }}
        className="w-100"
      >
        {body}
      </motion.div>
    </AnimatePresence>
  );
};

export default DesktopProductCatalogue;
