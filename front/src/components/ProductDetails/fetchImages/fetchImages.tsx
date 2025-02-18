import { useEffect } from 'react';
import { useState } from 'react';
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

  const urlConstructor = {
    urlbase: `https://images.napali.app/global/${brand}-products/all/default/hi-res/`,
    views: [
      'frt1',
      'frt2',
      'frt3',
      'frt4',
      'frt5',
      'frt6',
      'bck1',
      'bck2',
      'dtl1',
      'dtl2',
    ],
    shoot: [',f_', ',w_', ',v_'],
    extension: '.jpg',
  };

  async function getImages({ style, brand, color }: FetchImagesProps) {
    console.log('ici', { style, brand, color });
    const urls: string[] = [];
    urlConstructor.shoot?.forEach((elt: string) => {
      urlConstructor.views?.forEach((view: string) => {
        const url = `${
          urlConstructor.urlbase
        }${style.toLocaleLowerCase()}_${brand}${elt}${color.toLocaleLowerCase()}_${view}${
          urlConstructor.extension
        }`;
        urls.push(url);
      });
    });

    urls.forEach(async (url) => {
      await fetch(url).then((response) => {
        console.log(response.status);

        if (response.status === 200) {
          setImages((prevState) => [...prevState, { url: url }]);
        }
      });
    });
  }

  useEffect(() => {
    setImages([]); // Clear previous images
    getImages({ style, brand, color });
    setImageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {images.length > 1 ? (
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
    </div>
  );
}

export default FetchImages;
