import { useRef } from 'react';
import {
  patchProductAttributeStatus,
  patchProductStatus,
} from '../api/patch-status';
import useAttributes from '../stores/useAttributes';
import useProducts from '../stores/useProducts';
import useImages from '../stores/useImages';
import useDescription from '../stores/useDescription';
import { Toast } from 'primereact/toast';

const ControlButtons = () => {
  const { index, products, setProductIndex, setAllProducts } = useProducts();
  const { attributes, resetAttributes, setParentType, parent_type } =
    useAttributes();
  const { setAllImages, setIndexImage } = useImages();
  const { setDescription } = useDescription();

  const toast = useRef<Toast>(null);

  const submitChanges = () => {
    setIndexImage(0);
    const product = products[index];

    if (index + 1 < products.length) {
      patchProductAttributeStatus(product, attributes);
      patchProductStatus(product);
      setProductIndex(index + 1);
    } else {
      // Dernier produit du parent_type terminé
      patchProductAttributeStatus(product, attributes);
      patchProductStatus(product);

      // Réinitialiser tous les composants
      setAllImages([]);
      setAllProducts([]);
      setProductIndex(0);
      resetAttributes();
      setDescription(null);
      setParentType(
        parent_type.filter((type) => type.name !== product.parent_type)
      );
      showSuccess();
    }
  };

  const showSuccess = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'All products have been reviewed',
      life: 3000,
    });
  };

  return (
    <div className="control-buttons">
      <Toast ref={toast} />
      <button className="secondary-btn" onClick={submitChanges}>
        Submit
      </button>
      <button
        className="secondary-btn"
        onClick={() => {
          setProductIndex(index - 1);
          setIndexImage(0);
        }}
        disabled={index === 0}
      >
        Previous
      </button>
      <button
        className="secondary-btn"
        onClick={() => {
          setProductIndex(index + 1);
          setIndexImage(0);
        }}
        disabled={index + 1 >= products.length || products.length === 0}
      >
        Next
      </button>
    </div>
  );
};
export default ControlButtons;
