import styled from "styled-components";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import usePullUp from "webapp/lib/hooks/usePullUp";
import { useHistory } from "react-router-dom";
import { VaultName, VaultNameOptionMap } from "shared/lib/constants/constants";
import ReactPlayer from "react-player";
import colors from "shared/lib/designSystem/colors";

const FloatingContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100vh - ${theme.header.height}px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 600px;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;

const PlayerContainer = styled(ReactPlayer)`
  // height: 100%;
  // max-height: calc(100vh - ${theme.header.height}px);
  height: 400px;
  position: absolute;
  pointer-events: none !important;
  z-index: -1;
`;

const LandingContent = styled.div`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 16px !important;
  }

  h1 {
    color: white;
    font-size: 56px;
    font-family: VCR;
    text-transform: uppercase;
  }

  p {
    font-size: 16px;
    color: ${colors.tertiaryText};
  }

  button {
    font-size: 14px;
    color: ${colors.primaryText};
    padding: 8px 16px;
    background: none;
    border: 1px solid white;
    border-radius: 6px;
    display: block;
    margin: auto;
    font-family: VCR;
    text-transform: uppercase;
  }
`;

const Homepage = () => {
  usePullUp();
  const history = useHistory();

  const auth = localStorage.getItem("auth");

  if (auth) {
    const vault = JSON.parse(auth).pop();
    if (vault) {
      let vaultName;
      Object.keys(VaultNameOptionMap).filter((name) => {
        if (VaultNameOptionMap[name as VaultName] === vault) {
          vaultName = name;
        }
        return null;
      });
      history.push("/treasury/" + vaultName);
    }
  }

  const { video } = useScreenSize();

  return (
    <>
      <FloatingContainer>
        <PlayerContainer
          key="video-player"
          url="https://player.vimeo.com/video/722230744?h=772ecba04a&badge=0&autopause=0&player_id=0&app_id=58479"
          playing={true}
          width={video.width}
          height={video.height}
          style={{
            minWidth: video.width,
            minHeight: video.height,
          }}
          muted
          loop
        />
        <LandingContent>
          <h1>Treasury</h1>
          <p>Earn yield on your protocol's native token</p>
          <button>Apply for access</button>
          <a>A product by Ribbon Finance</a>
        </LandingContent>
      </FloatingContainer>
    </>
  );
};

export default Homepage;
