import { useEffect, useState } from 'react';
import useImages from '../stores/useImages';
import useProducts from '../stores/useProducts';
import { getImages } from '../api/get-images';

const Images = () => {
  const { images, setAllImages } = useImages();
  const { index, products, setAllProducts } = useProducts();
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    getImages({
      style: products[index].product_style,
      brand: products[index].brand_name,
      color: products[index].product_color,
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

      {images.length >= 1 ? (
        <>
          {/* Image principale */}
          <img
            src={images[imageIndex]?.url}
            alt="product"
            className="main-image"
          />

          {/* Navigation */}
          <div className="image-navigation">
            <button
              onClick={() => setImageIndex(imageIndex - 1)}
              disabled={imageIndex === 0}
            >
              {'<'}
            </button>
            <span>
              {imageIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setImageIndex(imageIndex + 1)}
              disabled={imageIndex + 1 >= images.length || images.length === 0}
            >
              {'>'}
            </button>
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="miniatures">
              {images.slice(1).map((image, idx) => (
                <div className="image-item" key={idx}>
                  <img src={image.url} alt={`product ${idx + 2}`} />
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
      {/* <div className="option-color"> */}
      {/* {availableColors.length > 3 ? (
        <button onClick={handleSliderLeft} disabled={displayed[0] == 1}>
          {'<'}
        </button>
      ) : null}
      {availableColors.map((elt, index) => {
        if (displayed.includes(index + 1))
          return (
            <button
              key={index}
              className={`color-button`}
              onClick={() => {
                setProductIndex(0);
                getImages({
                  style: style,
                  brand,
                  color: elt.color,
                });
              }}
            >
              <figure key={index}>
                <img
                  src={`https://images.napali.app/_/${brand}/hires/${style}_${elt.color}.jpg`}
                  alt="vignette"
                />
                <figcaption>{elt.color}</figcaption>
              </figure>
            </button>
          );
      })}
      {availableColors.length > 3 ? (
        <button
          onClick={handleSliderRight}
          disabled={displayed[displayed.length - 1] >= availableColors.length}
        >
          {'>'}
        </button>
      ) : null} */}
      {/* </div> */}
    </div>
  );
};

export default Images;
