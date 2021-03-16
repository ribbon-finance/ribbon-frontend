import React, { useState } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Title, PrimaryText, Button, BaseText } from "../../designSystem";
import { Container } from "react-bootstrap";
import Discord from "../../img/Footer/Discord.png";
import Twitter from "../../img/Footer/Twitter.png";
import Github from "../../img/Footer/Github.png";
import Blog from "../../img/Footer/Blog.png";
import Terms from "../../img/Footer/Terms.png";
import Policy from "../../img/Footer/Policy.png";
import FAQ from "../../img/Footer/FAQ.png";
import Other from "../../img/Footer/Other.png";

const MainContainer = styled(Container)`
  padding-bottom: 80px;
`;

const FooterCol = styled(Col)`
  padding: 0px !important;
  width: 100%;
`;

const FooterSection = styled.div`
  height: 400px;
  background-color: #0b0d14;
`;

const SectionText = styled(Title)`
  pointer-events: none;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
`;

function changeBackground(e: any, imgURL: string, color: string) {
  e.target.style.background = `linear-gradient(
    ${color}, 
    ${color}
  ), url(${imgURL}) no-repeat center`;
  e.target.style.backgroundSize = `cover`;
}

function resetBackground(e: any) {
  e.target.style.background = `#0b0d14`;
}

const Footer = () => {
  return (
    <Container fluid>
      <Row>
        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, Discord, "rgb(106,111,134,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>Discord</SectionText>
          </FooterSection>
        </FooterCol>

        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, Twitter, "rgb(114,157,237,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>Twitter</SectionText>
          </FooterSection>
        </FooterCol>

        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, Github, "rgb(115,244,194,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>Github</SectionText>
          </FooterSection>
        </FooterCol>

        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, Blog, "rgb(255,144,0,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>Blog</SectionText>
          </FooterSection>
        </FooterCol>

        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, Terms, "rgb(252,10,84,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>Terms</SectionText>
          </FooterSection>
        </FooterCol>

        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, Policy, "rgb(58,65,97,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>Policy</SectionText>
          </FooterSection>
        </FooterCol>

        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, FAQ, "rgb(101,138,209,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>FAQs</SectionText>
          </FooterSection>
        </FooterCol>

        <FooterCol md={3} sm={12} xs={12}>
          <FooterSection
            onMouseOver={(e: any) =>
              changeBackground(e, Other, "rgb(121,255,203,0.72)")
            }
            onMouseLeave={(e: any) => resetBackground(e)}
            className="d-flex justify-content-center align-items-center"
          >
            <SectionText>Other</SectionText>
          </FooterSection>
        </FooterCol>
      </Row>
    </Container>
  );
};

export default Footer;
