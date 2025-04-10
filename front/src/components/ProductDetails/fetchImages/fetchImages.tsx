import { useEffect, useState } from 'react';
import axios from 'axios';
import './fetchImages.scss';

type imagesProps = {
  url: string;
}[];

type FetchImagesProps = {
  style: string;
  brand: string;
  color: string;
};
function FetchImages({ style, brand, color }: FetchImagesProps) {
  const [images, setImages] = useState<imagesProps>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [availableColors, setAvailableColors] = useState([
    {
      color: '',
      style: '',
    },
  ]);

  async function getImages({ style, brand, color }: FetchImagesProps) {
    const urlbase = `https://images.napali.app/global/${brand}-products/all/default/hi-res/`;

    try {
      const response = await axios.get(
        `${
          process.env.NODE_ENV === 'production'
            ? import.meta.env.VITE_API_URL
            : import.meta.env.VITE_API_URL_DEV
        }/api/images/${brand}/${style}/${color}`
      );

      if (!response.data) {
        throw new Error('No images found');
      }

      const imageUrls = response.data.images_name.map(
        (image: { name: string }) => {
          return { url: urlbase + image.name };
        }
      );

      setImages(imageUrls);
      setImageIndex(0);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  async function getAvailableColors({ style }: FetchImagesProps) {
    try {
      const response = await axios.get(
        `${
          process.env.NODE_ENV === 'production'
            ? import.meta.env.VITE_API_URL
            : import.meta.env.VITE_API_URL_DEV
        }/api/images/colors/${style}/`
      );

      if (response.data) {
        setAvailableColors(response.data);
      }
    } catch (error) {
      console.error('Error fetching available colors:', error);
    }
  }

  useEffect(() => {
    setImages([]); // Clear previous images
    getImages({ style, brand, color });
    getAvailableColors({ style, brand, color });
    setImageIndex(0);
  }, [style, brand, color]);

  return (
    <div className="image">
      <button
        onClick={() => setImageIndex(imageIndex + 1)}
        className="arrow-button-next"
        disabled={imageIndex + 1 == images.length || images.length === 0}
      >
        {'>'}
      </button>
      {images.length >= 1 ? (
        images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt="product"
            className={index == imageIndex ? 'visible' : 'hidden'}
          />
        ))
      ) : (
        <p className="no-img-callout">No images found</p>
      )}
      <button
        onClick={() => setImageIndex(imageIndex - 1)}
        className="arrow-button-prev"
        disabled={imageIndex === 0}
      >
        {'<'}
      </button>
      <div className="option-color">
        {availableColors.map((elt, index) => (
          <>
            <button
              key={index}
              className={`color-button`}
              onClick={() => {
                setImageIndex(0);
                getImages({
                  style: style,
                  brand,
                  color: elt.color,
                });
              }}
            >
              <figure>
                <img
                  src={`https://images.napali.app/_/${brand}/hires/${style}_${elt.color}.jpg`}
                  alt="vignette"
                />
                <figcaption>{elt.color}</figcaption>
              </figure>
            </button>
          </>
        ))}
      </div>
    </div>
  );
}

export default FetchImages;
