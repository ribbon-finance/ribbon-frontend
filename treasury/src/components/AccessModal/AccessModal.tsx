import BasicModal from "shared/lib/components/Common/BasicModal"
import TreasuryActionsForm from "../Vault/VaultActionsForm/TreasuryActionsForm"

interface AccessModalProps {
    show: boolean;
    onClose: () => void;
}

export const AccessModal: React.FC<AccessModalProps> = ({ show, onClose }) => {
    return <BasicModal show={show} height={580} onClose={onClose}><TreasuryActionsForm variant="desktop"/></BasicModal>
}