import React from "react";
import styled from "styled-components";
import PerformanceChart from "../../components/PerformanceChart/PerformanceChart";
import { PrimaryText, SecondaryText, Title } from "../../designSystem";

const Paragraph = styled.div`
  margin-bottom: 64px;
`;

const ParagraphHeading = styled(Title)`
  display: block;
  font-size: 24px;
  margin-bottom: 16px;
`;

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 24px;
`;

const LinkIcon = styled.i`
  width: 24px;
  height: 24px;
`;

const PerformanceSection = () => {
  return (
    <div className="col-lg-6">
      <Paragraph>
        <ParagraphHeading>Vault Performance</ParagraphHeading>
        <PerformanceChart></PerformanceChart>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Vault Strategy</ParagraphHeading>
        <ParagraphText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis enim lobortis scelerisque fermentum dui faucibus in ornare
          quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet
          massa vitae tortor condimentum lacinia quis vel eros donec ac odio
          tempor orci dapibus ultrices in iaculis nunc sed augue lacus.
        </ParagraphText>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Withdrawal Fee - 0.5%</ParagraphHeading>
        <ParagraphText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna.
        </ParagraphText>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Risk</ParagraphHeading>
        <ParagraphText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna.
        </ParagraphText>

        <PrimaryText className="d-block mt-3">
          <span className="mr-2">Read More</span>
          <LinkIcon className="fas fa-external-link-alt"></LinkIcon>
        </PrimaryText>
      </Paragraph>
    </div>
  );
};

export default PerformanceSection;
