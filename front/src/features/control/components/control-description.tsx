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
      {description ? (
        <>
          {description.product_description &&
          description.product_description.trim() !== '' ? (
            <p className="desc-main">{description.product_description}</p>
          ) : null}
          {description.product_characteristic &&
          description.product_characteristic.trim() !== '' ? (
            <p className="desc-characteristic">
              {description.product_characteristic}
            </p>
          ) : null}
          {!description.product_description &&
            !description.product_characteristic && (
              <p>No description available</p>
            )}
        </>
      ) : (
        <p>No description</p>
      )}
    </div>
  );
};
export default Description;
