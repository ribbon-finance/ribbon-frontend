import React from "react";
import colors from "../../designSystem/colors";
import { SecondaryText, Title } from "../../designSystem";
import { ActionButton } from "../../components/Common/buttons";
import BasicModal from "./BasicModal";
import { BaseModalContentColumn } from "../../designSystem";
import { useTranslation } from "react-i18next";

interface ExternalLinkWarningModalProps {
  onClose: () => void;
  show: boolean;
  onContinue: () => void;
}

const ExternalLinkWarningModal: React.FC<ExternalLinkWarningModalProps> = ({
  onClose,
  show,
  onContinue,
}) => {
  const { t } = useTranslation();
  return (
    <BasicModal
      show={show}
      height={264}
      maxWidth={340}
      onClose={onClose}
      headerBackground
    >
      <>
        <BaseModalContentColumn marginTop={8}>
          <Title>{t("shared:WarningModal:leavingSite")}</Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={48} className="text-align-center">
          <SecondaryText
            fontSize={16}
            style={{
              textAlign: "center",
            }}
          >
            {t("shared:WarningModal:redacted:message")}
          </SecondaryText>
        </BaseModalContentColumn>
        <ActionButton
          onClick={onContinue}
          className="mt-auto py-3 mb-2"
          color={colors.green}
        >
          {t("shared:WarningModal:redacted:proceed")}
        </ActionButton>
      </>
    </BasicModal>
  );
};

export default ExternalLinkWarningModal;
