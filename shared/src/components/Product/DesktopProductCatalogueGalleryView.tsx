import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import MultiselectFilterDropdown from "../Common/MultiselectFilterDropdown";
import SwitchViewButton from "./Shared/SwitchViewButton";
import { DesktopViewType } from "./types";

const FilterContainer = styled.div`
  display: flex;
  background: ${colors.backgroundDarker};
  padding: 8px;
  border-radius: ${theme.border.radius};
  box-shadow: 4px 8px 40px rgba(0, 0, 0, 0.24);

  & > * {
    margin-right: 8px;

    &:last-child {
      margin-right: unset;
    }
  }
`;

interface DesktopProductCatalogueGridViewProps {
  setView?: React.Dispatch<React.SetStateAction<DesktopViewType>>;
}

const DesktopProductCatalogueGalleryView: React.FC<DesktopProductCatalogueGridViewProps> = ({
  setView,
}) => (
  <Container className="mt-4">
    <Row>
      <Col xs="6" className="d-flex flex-wrap">
        <div className="d-flex w-100">
          <FilterContainer>
            <MultiselectFilterDropdown
              options={[{ value: "lol", display: "lol" }]}
              title="FILTERS"
              onSelect={() => {}}
              dropdownOrientation="left"
            />
            <MultiselectFilterDropdown
              options={[{ value: "lol", display: "lol" }]}
              title="SORT BY"
              onSelect={() => {}}
              dropdownOrientation="left"
            />
            {setView && <SwitchViewButton view="gallery" setView={setView} />}
          </FilterContainer>
        </div>
      </Col>
    </Row>
  </Container>
);

export default DesktopProductCatalogueGalleryView;
