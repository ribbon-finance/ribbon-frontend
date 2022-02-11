import { Container, Row } from "react-bootstrap";
import GovernanceSection from "../components/Faq/GovernanceSection";
import RibbonFinanceSection from "../components/Faq/RibbonFinanceSection";
import VaultSection from "../components/Faq/VaultSection";
import VERBNSection from "../components/Faq/VERBNSection";

const Faqs = () => {
  return (
    <Container>
      <Row className="justify-content-center mb-5">
        <RibbonFinanceSection />
        <VERBNSection />
        <GovernanceSection />
        <VaultSection />
      </Row>
    </Container>
  );
};

export default Faqs;
