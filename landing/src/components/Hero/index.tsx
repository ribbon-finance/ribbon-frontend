import React, { useState } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Title, PrimaryText, Button } from "../../designSystem";
import { Container } from "react-bootstrap";
import ShapeA from "../../img/ShapeA.svg";
import ShapeB from "../../img/ShapeB.svg";
import ShapeC from "../../img/ShapeC.svg";
import ShapeD from "../../img/ShapeD.svg";
import ShapeE from "../../img/ShapeE.svg";

const ColorColumn = styled(Col)<{
  activeColor: string;
  passiveColor: string;
}>`
  height: 640px;
  width: 20%;
  background-color: ${(p) => p.passiveColor};
`;

const MainContainer = styled(Container)`
  height: 640px;
`;

const TextContainer = styled(Row)`
  pointer-events: none;
  height: 100%;
  align-items: center;
`;

const SubtitleContainer = styled.div`
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
`;

const BackgroundContainer = styled(Row)`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
`;

const SubTitle = styled(PrimaryText)`
  color: #ffffff;
`;

const Hero = () => {
  const [col, setCol] = useState(0);
  const colToShape = [ShapeA, ShapeB, ShapeC, ShapeD, ShapeE];

  enum PassiveColors {
    "#251F18",
    "#202320",
    "#1F1F21",
    "#1C1A19",
  }

  enum ActiveColors {
    "#FF385C",
    "#FF9000",
    "#79FFCB",
    "#729DED",
  }

  function changeBackground(e: any, column: number) {
    e.target.style.background = ActiveColors[column];
    setCol(column);
  }

  function resetBackground(e: any, column: number) {
    e.target.style.background = PassiveColors[column];
  }

  return (
    <MainContainer fluid>
      <Container fluid style={{ position: "relative" }}>
        <BackgroundContainer>
          <ColorColumn
            passiveColor={PassiveColors[0]}
            onMouseOver={(e: any) => changeBackground(e, 0)}
            onMouseLeave={(e: any) => resetBackground(e, 0)}
          />
          <ColorColumn
            passiveColor={PassiveColors[1]}
            onMouseOver={(e: any) => changeBackground(e, 1)}
            onMouseLeave={(e: any) => resetBackground(e, 1)}
          />
          <ColorColumn
            passiveColor={PassiveColors[2]}
            onMouseOver={(e: any) => changeBackground(e, 2)}
            onMouseLeave={(e: any) => resetBackground(e, 2)}
          />
          <ColorColumn
            passiveColor={PassiveColors[3]}
            onMouseOver={(e: any) => changeBackground(e, 3)}
            onMouseLeave={(e: any) => resetBackground(e, 3)}
          />
        </BackgroundContainer>
      </Container>
      <TextContainer>
        <Col md={{ span: 7, offset: 1 }}>
          <Title>Sustainable Alpha For Everyone</Title>

          <SubtitleContainer>
            <SubTitle>
              Earn yield on your cryptoassets with DeFi's first structured
              products protocol.
            </SubTitle>
          </SubtitleContainer>

          <ButtonContainer>
            <Button>OPEN APP</Button>
          </ButtonContainer>
        </Col>
        <Col md={{ span: 4 }}>
          <img src={colToShape[col]} style={{ height: 300 }}></img>
        </Col>
      </TextContainer>
    </MainContainer>
  );
};

export default Hero;
