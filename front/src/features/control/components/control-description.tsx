import { useEffect } from 'react';
import { getDescription } from '../api/get-description';
import useProducts from '../stores/useProducts';
import useDescription from '../stores/useDescription';

const Description = () => {
  const { description, setDescription } = useDescription();
  const { index, products } = useProducts();

  useEffect(() => {
    if (products.length === 0) return;
    getDescription('english', products[index]?.product_style)
      .then((data) => {
        if (data) {
          setDescription(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching description:', error);
      });
  }, [setDescription, index, products]);
  return (
    <div className="control-description">
      <h3>Product Info</h3>
      {products.length === 0 ? (
        <div className="no-products">
          <p>Please select a parent type to view description</p>
        </div>
      ) : description ? (
        <div>
          <p className="desc-main">Label : {description.label}</p>
          <p className="desc-characteristic">
            Product type : {description.product_type}
          </p>
          {description.product_description &&
          description.product_description.trim() !== '' ? (
            <div
              className="desc-main"
              dangerouslySetInnerHTML={{
                __html: description.product_description,
              }}
            />
          ) : null}
          {description.product_characteristic &&
          description.product_characteristic.trim() !== '' ? (
            <div
              className="desc-characteristic"
              dangerouslySetInnerHTML={{
                __html: description.product_characteristic,
              }}
            />
          ) : null}
          {!description.product_description &&
            !description.product_characteristic && (
              <p>No description available</p>
            )}
        </div>
      ) : (
        <p>No description</p>
      )}
    </div>
  );
};
export default Description;
