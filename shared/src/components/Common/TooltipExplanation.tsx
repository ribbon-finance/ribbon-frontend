import React, { useState } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { OverlayTriggerRenderProps } from "react-bootstrap/esm/OverlayTrigger";

import TooltipExplanationContent from "./TooltipExplanationContent";

interface TooltipExplanationProps {
  title: string;
  explanation: React.ReactNode;
  learnMoreURL?: string;
  renderContent: (
    props: OverlayTriggerRenderProps & React.HTMLAttributes<HTMLElement>
  ) => React.ReactNode;
}

const TooltipExplanation: React.FC<TooltipExplanationProps> = ({
  title,
  explanation,
  learnMoreURL,
  renderContent,
}) => {
  const [show, setShow] = useState(false);

  return (
    <OverlayTrigger
      overlay={(props) => (
        <TooltipExplanationContent
          title={title}
          explanation={explanation}
          overlayInjectedProps={props}
          learnMoreURL={learnMoreURL}
          setShow={setShow}
        />
      )}
      show={show}
    >
      {(props) =>
        renderContent({
          ...props,
          onMouseOver: () => setShow(true),
          onMouseOut: () => setShow(false),
        })
      }
    </OverlayTrigger>
  );
};

export default TooltipExplanation;
