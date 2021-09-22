import React from "react";
import { Container } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const ContentContainer = styled(motion.div)`
  margin-top: 40px;
  margin-bottom: 64px;
`;

const Homepage = () => {
  return (
    <>
      <Container>
        <AnimatePresence exitBeforeEnter>
          <ContentContainer
            key={"key"}
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
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
          ></ContentContainer>
        </AnimatePresence>
      </Container>
    </>
  );
};

export default Homepage;
