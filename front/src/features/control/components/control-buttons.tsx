import { useMemo, useRef } from 'react';
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

  const { remaining, current, total } = useMemo(() => {
    const total = products.length;
    const current = total > 0 ? Math.min(index + 1, total) : 0;
    const remaining = Math.max(total - current, 0);
    return { remaining, current, total };
  }, [products.length, index]);

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
      <div
        className="remaining-counter"
        aria-live="polite"
        aria-atomic="true"
        title="Produits restants à valider"
      >
        <span className="remaining-count">{remaining}</span>
        <span className="remaining-label"> restants</span>
        {total > 0 && (
          <span className="remaining-ratio">
            {' '}
            ({current}/{total})
          </span>
        )}
      </div>
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
