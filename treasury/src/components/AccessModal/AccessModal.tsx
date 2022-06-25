import BasicModal from "shared/lib/components/Common/BasicModal";
import { useWebappGlobalState } from "../../store/store";
import TreasuryActionsForm from "../Vault/VaultActionsForm/TreasuryActionsForm";

export const AccessModal: React.FC = () => {
const [isAccessModalVisible, setAccessModal] = useWebappGlobalState("isAccessModalVisible");

  return (
    <BasicModal show={isAccessModalVisible} height={516} maxWidth={428} onClose={() => setAccessModal(false)}>
      <TreasuryActionsForm variant="desktop" />
    </BasicModal>
  );
};
