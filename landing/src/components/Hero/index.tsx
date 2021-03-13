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
  background-image: url(data:image/png;base64,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) !important;
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
    "#181618",
    "#120F12",
    "#0D141A",
    "#0C101C",
    "#0A0C16",
  }

  enum ActiveColors {
    "#FC0A54",
    "#FF9000",
    "#79FFCB",
    "#729DED",
    "#3A4161",
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
          <ColorColumn
            passiveColor={PassiveColors[4]}
            onMouseOver={(e: any) => changeBackground(e, 4)}
            onMouseLeave={(e: any) => resetBackground(e, 4)}
          />
        </BackgroundContainer>
      </Container>
      <TextContainer>
        <Col md={{ span: 6, offset: 1 }}>
          <Title>Lorem ipsum dolor sit amet</Title>

          <SubtitleContainer>
            <SubTitle>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
              aliquam, purus sit amet luctus venenatis
            </SubTitle>
          </SubtitleContainer>

          <ButtonContainer>
            <Button>Lorem Ipsum</Button>
          </ButtonContainer>
        </Col>
        <Col md={{ span: 4, offset: 1 }}>
          <img src={colToShape[col]} style={{ height: 300, width: 300 }}></img>
        </Col>
      </TextContainer>
    </MainContainer>
  );
};

export default Hero;
