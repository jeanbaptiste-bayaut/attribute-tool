import { useEffect, useState } from 'react';
import useAttributes from '../stores/useAttributes';
import { getAttributesListById } from '../api/get-attributes';
import useProducts from '../stores/useProducts';

const Attributes = () => {
  const { attributes, setAllAttributes, resetAttributes } = useAttributes();
  const { index, products } = useProducts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products.length === 0) return;

    getAttributesListById(parseInt(products[index]?.product_id))
      .then((data) => {
        setAllAttributes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching attributes:', error);
        setIsLoading(false);
      });
  }, [setAllAttributes, index, products, resetAttributes]);

  // Fonction pour changer le status d'un attribut
  const handleOnChange = (idx: number) => {
    const updated = attributes.map((attr, i) =>
      i === idx ? { ...attr, status: !attr.status } : attr
    );
    setAllAttributes(updated);
  };

  return (
    <div className="control-attributes">
      <h3>Product Attributes</h3>
      {products.length === 0 ? (
        <div className="no-products">
          <p>Please select a parent type to view attributes</p>
        </div>
      ) : isLoading ? (
        <div>Loading attributes...</div>
      ) : (
        <ul>
          {attributes.map((attribute, idx) => (
            <li key={idx} className="attribute-list-container">
              <div className="attribute-info">
                <span>
                  {attribute.attribute_name} {' : '}
                  {attribute.value_name}
                </span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  id={`switch-${idx}`}
                  name={`${attribute.attribute_name}:${attribute.value_name}`}
                  value={`${attribute.attribute_name}:${attribute.value_name}`}
                  checked={attribute.status}
                  onChange={() => handleOnChange(idx)}
                />
                <span className="slider"></span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Attributes;
