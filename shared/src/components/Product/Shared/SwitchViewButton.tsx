import React, { useMemo } from "react";
import styled from "styled-components";
import { GalleryIcon, GridIcon } from "../../../assets/icons/icons";

import colors from "../../../designSystem/colors";
import theme from "../../../designSystem/theme";
import { DesktopViewType } from "../types";

const Button = styled.div`
  background: ${colors.primaryText}0A;
  height: 45px;
  width: 45px;
  border-radius: ${theme.border.radius};

  &:hover {
    background: ${colors.primaryText}14;
  }
`;

interface SwitchViewButtonProps {
  view: DesktopViewType;
  setView: React.Dispatch<React.SetStateAction<DesktopViewType>>;
}

const SwitchViewButton: React.FC<SwitchViewButtonProps> = ({
  view,
  setView,
}) => {
  const viewIcon = useMemo(() => {
    switch (view) {
      case "gallery":
        return <GridIcon />;
      case "grid":
        return <GalleryIcon />;
    }
  }, [view]);

  return (
    <Button
      role="button"
      className="d-flex align-items-center justify-content-center"
      onClick={() => setView((v) => (v === "grid" ? "gallery" : "grid"))}
    >
      {viewIcon}
    </Button>
  );
};

export default SwitchViewButton;
