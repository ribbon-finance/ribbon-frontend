import React from "react";

import { Subtitle } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { useNFTDropGlobalState } from "../../store/store";

const VideoView: React.FC = () => {
  const [, setViews] = useNFTDropGlobalState("homepageView");

  return (
    <div>
      <Subtitle
        fontSize={14}
        lineHeight={20}
        color={colors.text}
        role="button"
        onClick={() => setViews("claim")}
      >
        Skip Video
      </Subtitle>
    </div>
  );
};

export default VideoView;
