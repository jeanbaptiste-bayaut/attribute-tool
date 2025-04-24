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
  const [displayed, setDisplayed] = useState([1, 2, 3]);

  function handleSliderLeft() {
    const newDisplayed = displayed.slice(0, displayed.length - 1);
    newDisplayed.unshift(newDisplayed[0] - 1);
    setDisplayed(newDisplayed);
  }

  function handleSliderRight() {
    const newDisplayed = displayed.slice(1);
    newDisplayed.push(newDisplayed[newDisplayed.length - 1] + 1);
    setDisplayed(newDisplayed);
  }

  async function getImages({ style, brand, color }: FetchImagesProps) {
    const urlbase = `https://images.napali.app/global/${brand}-products/all/default/hi-res/`;

    try {
      let imageUrls = [];
      const response = await axios.get(
        `${
          process.env.NODE_ENV === 'production'
            ? import.meta.env.VITE_API_URL
            : import.meta.env.VITE_API_URL_DEV
        }/api/images/${brand}/${style}/${color}`
      );

      if (!response.data) {
        imageUrls.push({
          url: `https://images.napali.app/_/${brand}/hires/${style}_${color}.jpg`,
        });
      } else {
        imageUrls = response.data.images_name.map((image: { name: string }) => {
          return { url: urlbase + image.name };
        });
      }
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
    setDisplayed([1, 2, 3]);
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
        <div className="no-img">
          <p className="no-img-callout">No images found</p>
        </div>
      )}
      <button
        onClick={() => setImageIndex(imageIndex - 1)}
        className="arrow-button-prev"
        disabled={imageIndex === 0}
      >
        {'<'}
      </button>
      <div className="option-color">
        {availableColors.length > 3 ? (
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
                  setImageIndex(0);
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
        ) : null}
      </div>
    </div>
  );
}

export default FetchImages;
