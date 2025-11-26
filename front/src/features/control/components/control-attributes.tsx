import { useEffect, useState } from 'react';
import useAttributes from '../stores/useAttributes';
import { getAttributesListById, getAttributes } from '../api/get-attributes';
import useProducts from '../stores/useProducts';
import { Value } from '../../control/types/product.schemas';

const Attributes = () => {
  const { attributes, setAllAttributes, resetAttributes } = useAttributes();
  const { index, products } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<Value[]>([]);

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
  const handleOnChangeStatus = (idx: number) => {
    const updated = attributes.map((attr, i) =>
      i === idx ? { ...attr, status: !attr.status } : attr
    );
    setAllAttributes(updated);
  };

  const triggerValuesList = async (attribute: string) => {
    const list = await getAttributes(attribute);
    setList(list);
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
          {(() => {
            // repérer la première occurrence de chaque attribute_name
            const firstIndexByAttr = new Map<string, number>();

            attributes.forEach((a, i) => {
              if (!firstIndexByAttr.has(a.attribute_name)) {
                firstIndexByAttr.set(a.attribute_name, i);
              }
            });

            return attributes.map((attribute, idx) => {
              const isFirstForAttribute =
                firstIndexByAttr.get(attribute.attribute_name) === idx;

              const firstIdx = firstIndexByAttr.get(attribute.attribute_name)!;

              const selectedValue =
                (attributes[firstIdx] && attributes[firstIdx].addAttribute) ||
                attribute.value_name ||
                '';

              return (
                <li
                  key={`${attribute.attribute_name}-${idx}`}
                  className="attribute-list-container"
                >
                  <div className="attribute-info">
                    <span>
                      {attribute.attribute_name} {' : '}
                      {attribute.value_name}
                    </span>
                  </div>

                  <label
                    className="cross"
                    title={`Ajouter valeur pour ${attribute.attribute_name}`}
                  >
                    <span
                      className="plus"
                      onClick={() => {
                        triggerValuesList(attribute.attribute_name);
                      }}
                    />
                  </label>

                  {isFirstForAttribute &&
                    list.length > 0 &&
                    list.some(
                      (item) => item.attribute === attribute.attribute_name
                    ) && (
                      <select
                        onChange={(e) => {
                          const newVal = e.target.value;
                          // Mettre addAttribute sur la première occurrence (et garder cohérence)
                          const updated = attributes.map((attr, i) =>
                            i === firstIdx &&
                            attr.attribute_name === attribute.attribute_name
                              ? { ...attr, addAttribute: newVal }
                              : attr
                          );
                          setAllAttributes(updated);
                          setList([]);
                        }}
                        value={selectedValue}
                      >
                        <option value="">Select Value</option>
                        {list
                          .filter(
                            (v) => v.attribute === attribute.attribute_name
                          )
                          .map((value, index: number) => (
                            <option
                              key={`${value.name}-${index}`}
                              value={value.name}
                            >
                              {value.name}
                            </option>
                          ))}
                      </select>
                    )}

                  <label className="switch">
                    <input
                      type="checkbox"
                      id={`switch-${idx}`}
                      name={`${attribute.attribute_name}:${attribute.value_name}`}
                      value={`${attribute.attribute_name}:${attribute.value_name}`}
                      checked={!!attribute.status}
                      onChange={() => handleOnChangeStatus(idx)}
                    />
                    <span className="slider"></span>
                  </label>
                </li>
              );
            });
          })()}
        </ul>
      )}
    </div>
  );
};

export default Attributes;
