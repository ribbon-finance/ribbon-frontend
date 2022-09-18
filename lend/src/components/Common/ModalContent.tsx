import { useMemo } from "react";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { URLS } from "shared/lib/constants/constants";
import styled, { css } from "styled-components";
import ExternalLinkIcon from "./ExternalLinkIcon";
import twitter from "../../assets/icons/socials/twitter.svg";
import discord from "../../assets/icons/socials/discord.svg";
import github from "../../assets/icons/socials/github.png";
import { ProductDisclaimer } from "../ProductDisclaimer";

const AboutContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const CommunityContent = styled.div`
  > div:not(:last-child) {
    border: 1px solid transparent;
    border-bottom: 1px solid ${colors.primaryText}1F;
  }
`;

const CommunityContentRow = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  font-size: 14px;
  transition: 0.2s ease-in-out;

  ${({ onClick }) => {
    if (onClick) {
      return css`
        &:hover {
          cursor: pointer;
          > svg {
            transform: translate(2px, -2px);
          }
        }
      `;
    }
    return "";
  }}

  ${({ color }) => {
    return css`
      &:hover {
        transition: 0.2s ease-in-out;
        border: 1px solid ${color} !important;
        box-shadow: inset 0 0 5px ${color};
        background: ${color}10;
      }
    `;
  }}

  > img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }

  > svg {
    transition: all 0.2s ease-in-out;
    margin-left: 8px;
    width: 20px;
    height: 20px;
  }
`;

const CommunityContentFooter = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0;
  font-size: 14px;
`;

export enum ContentEnum {
  ABOUT = "ABOUT",
  COMMUNITY = "COMMUNITY",
  WALLET = "CONNECT WALLET",
}

interface ModalContentProps {
  content?: ContentEnum;
}

export const ModalContent = ({ content }: ModalContentProps) => {
  const modalContent = useMemo(() => {
    if (content === ContentEnum.ABOUT) {
      return (
        <AboutContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis enim lobortis scelerisque fermentum dui faucibus in ornare
          quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet
          massa vitae tortor condimentum lacinia
        </AboutContent>
      );
    }
    if (content === ContentEnum.COMMUNITY) {
      return (
        <CommunityContent>
          <CommunityContentRow
            onClick={() => window.open(URLS.twitter)}
            color={"#1D9BF0"}
          >
            <img src={twitter} alt="Twitter" />
            <Title>Twitter</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow
            onClick={() => window.open(URLS.discord)}
            color={"#5865F2"}
          >
            <img src={discord} alt="Discord" />
            <Title>Discord</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow
            onClick={() => window.open(URLS.github)}
            color={"#FFFFFF"}
          >
            <img src={github} alt="Github" />
            <Title>Github</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentFooter>
            <ProductDisclaimer />
          </CommunityContentFooter>
        </CommunityContent>
      );
    }
    return null;
  }, [content]);

  return modalContent;
};
