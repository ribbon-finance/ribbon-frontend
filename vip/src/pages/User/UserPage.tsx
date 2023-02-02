import ProductCatalogue from "shared/lib/components/Product/ProductCatalogue";
import { useHistory, Redirect } from "react-router-dom";
import { getVaultURI } from "../../constants/constants";
import { useStorage } from "../../hooks/useStorageContextProvider";

const UserPage = () => {
  const history = useHistory();
  const [storage] = useStorage();
  console.log(storage);
  /**
   * Redirect to homepage if no passcode and no cache in storage
   */

  if (!storage) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <ProductCatalogue
        variant="vip"
        onVaultPress={(vault, version) => history.push(getVaultURI(vault))}
      ></ProductCatalogue>
    </>
  );
};

export default UserPage;
