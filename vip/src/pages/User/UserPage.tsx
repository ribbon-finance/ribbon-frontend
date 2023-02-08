import ProductCatalogue from "shared/lib/components/Product/ProductCatalogue";
import { useHistory, Redirect } from "react-router-dom";
import { getVaultURI } from "../../constants/constants";
import { useStorage } from "../../hooks/useStorageContextProvider";
import styled from "styled-components";
import theme from "shared/lib/designSystem/theme";

const UserPageContainer = styled.div`
  min-height: calc(
    100vh - ${theme.header.height}px - 2 * ${theme.footer.desktop.height}px
  );
`;

const UserPage = () => {
  const history = useHistory();
  const [storage] = useStorage();
  /**
   * Redirect to homepage if no passcode and no cache in storage
   */

  if (!storage) {
    return <Redirect to="/" />;
  }

  return (
    <UserPageContainer>
      <ProductCatalogue
        variant="vip"
        onVaultPress={(vault, version) => history.push(getVaultURI(vault))}
      ></ProductCatalogue>
    </UserPageContainer>
  );
};

export default UserPage;
