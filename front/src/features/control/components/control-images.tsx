import { useEffect } from 'react';
import useImages from '../stores/useImages';
import useProducts from '../stores/useProducts';
import { getImages } from '../api/get-images';
import { Image } from 'primereact/image';

const Images = () => {
  const { images, setAllImages, indexImage, setIndexImage } = useImages();
  const { index, products, setAllProducts } = useProducts();

  useEffect(() => {
    if (products.length === 0) return;
    getImages({
      style: products[index].product_style.toLowerCase(),
      brand: products[index].brand_name.toLowerCase(),
      color: products[index].product_color.toLowerCase(),
    })
      .then((fetchedImages) => {
        setAllImages(fetchedImages);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, [setAllImages, setAllProducts, index, products]);

  return (
    <div className="control-images">
      <h3>Product Images</h3>

      {products.length === 0 ? (
        <div className="no-products">
          <p>Please select a parent type to view images</p>
        </div>
      ) : images.length >= 1 ? (
        <>
          <Image
            src={images[indexImage]?.url}
            alt="product"
            preview
            className="image-container"
            width="300"
          />

          {/* Navigation */}
          <div className="image-navigation">
            <button
              onClick={() => setIndexImage(indexImage - 1)}
              disabled={indexImage === 0}
            >
              {'<'}
            </button>
            <span>
              {indexImage + 1} / {images.length}
            </span>
            <button
              onClick={() => setIndexImage(indexImage + 1)}
              disabled={indexImage + 1 >= images.length || images.length === 0}
            >
              {'>'}
            </button>
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="miniatures">
              {images.slice(1, 8).map((image, idx) => (
                <div className="image-item" key={idx}>
                  <img
                    src={image.url}
                    alt={`product ${idx + 2}`}
                    onClick={() => setIndexImage(idx + 1)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="no-img">
          <p className="no-img-callout">No images found</p>
        </div>
      )}
    </div>
  );
};

export default Images;
