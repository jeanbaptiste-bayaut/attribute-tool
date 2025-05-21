import './ProductDetails.scss';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import FetchImages from './fetchImages/fetchImages';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

interface ProductDetailsProps {
  product: {
    product_name: string;
    product_style: string;
    product_color: string;
    image_url: string;
    brand_name: string;
  } | null;
}

interface DescriptionProps {
  id: number;
  locale: string;
  label: string;
  product_type: string;
  product_description: string;
  product_characteristic: string;
  product_composition: string;
  product_id: number;
}

// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)',
//     width: '500px',
//     height: '350px',
//   },
// };

Modal.setAppElement('#root');

const ProductDetails = ({ product }: ProductDetailsProps) => {
  // const [modalIsOpen, setIsOpen] = useState(false);
  // const [formData, setFormData] = useState('');
  //const [commentSent, setCommentSent] = useState(false);
  //const [descriptionFormat, setDescriptionFormat] =
  //useState<(string | JSX.Element)[]>();
  const [description, setDescription] = useState<DescriptionProps>();

  // function openModal() {
  //   setIsOpen(true);
  //   //getComment();
  // }

  // function closeModal() {
  //   setIsOpen(false);
  // }

  async function getDescription(locale: string, style: string | undefined) {
    try {
      const result = await axios.get(
        `${
          process.env.NODE_ENV === 'production'
            ? import.meta.env.VITE_API_URL
            : import.meta.env.VITE_API_URL_DEV
        }/api/descriptions/${locale}/${style}`
      );

      if (result.data) {
        const characteristicsFormated = formatDescription(
          result.data.product_characteristic
        );

        const description = {
          ...result.data,
          product_characteristic: characteristicsFormated,
        };
        setDescription(description);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // async function getComment() {
  //   setFormData('');
  //   try {
  //     const result = await axios.get(
  //       `${
  //         process.env.NODE_ENV === 'production'
  //           ? import.meta.env.VITE_API_URL
  //           : import.meta.env.VITE_API_URL_DEV
  //       }/api/descriptions/comment/${product?.product_style}`
  //     );

  //     if (result.data) setFormData(result.data.comment);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // async function handleSubmit(event: React.FormEvent) {
  //   event.preventDefault();

  //   const form = event.target as HTMLFormElement;
  //   const formData = new FormData(form);
  //   const formJson = Object.fromEntries(formData.entries());
  //   if (product?.product_style) {
  //     formJson['style'] = product.product_style;
  //   }

  //   try {
  //     const result = await axios.post(
  //       `${
  //         process.env.NODE_ENV === 'production'
  //           ? import.meta.env.VITE_API_URL
  //           : import.meta.env.VITE_API_URL_DEV
  //       }/api/descriptions/comment`,
  //       formJson
  //     );

  //     if (result.status === 200) {
  //       setCommentSent(!commentSent);
  //       setFormData('');
  //       closeModal();
  //     }

  //     setTimeout(() => {
  //       setCommentSent(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  function formatDescription(text: string) {
    text = `${text}`;
    const characteristics = text.replace(/__([^:]+):__/g, '$1:');

    characteristics?.replace(/([^:\n]) ([A-Z][a-z]+:)/g, '$1\n$2');

    console.log(characteristics);

    return characteristics;
  }

  useEffect(() => {
    getDescription('english', product?.product_style);
  }, [product]);

  if (!product) {
    // Si le produit n'est pas encore défini, on peut afficher un chargement ou rien
    return <div>Loading...</div>;
  }

  return (
    <div className="image-description">
      <FetchImages
        style={product.product_style}
        brand={product.brand_name}
        color={product.product_color}
      />
      <div className="title">
        <div className="locales">
          <ul>
            <li
              className={
                'english' + (description?.locale === 'master' ? ' active' : '')
              }
              onClick={() => {
                getDescription('english', product.product_style);
              }}
            >
              EN
            </li>
            <li
              className={
                'german' + (description?.locale === 'de' ? ' active' : '')
              }
              onClick={() => {
                getDescription('german', product.product_style);
              }}
            >
              DE
            </li>
            <li
              className={
                'french' + (description?.locale === 'fr' ? ' active' : '')
              }
              onClick={() => {
                getDescription('french', product.product_style);
              }}
            >
              FR
            </li>
            <li
              className={
                'spanish' + (description?.locale === 'es' ? ' active' : '')
              }
              onClick={() => {
                getDescription('spanish', product.product_style);
              }}
            >
              ES
            </li>
            <li
              className={
                'italian' + (description?.locale === 'it' ? ' active' : '')
              }
              onClick={() => {
                getDescription('italian', product.product_style);
              }}
            >
              IT
            </li>
            <li
              className={
                'dutch' + (description?.locale === 'nl' ? ' active' : '')
              }
              onClick={() => {
                getDescription('dutch', product.product_style);
              }}
            >
              NL
            </li>
            <li
              className={
                'portuguese' + (description?.locale === 'pt' ? ' active' : '')
              }
              onClick={() => {
                getDescription('portuguese', product.product_style);
              }}
            >
              PT
            </li>
          </ul>
        </div>
        <h3 className={description?.locale}>
          {description?.label} - {product.product_style} -{' '}
          {product.product_color}
        </h3>
      </div>
      {description && (
        <div className="description">
          <div className="text">Type : {description?.product_type}</div>
          <div className="text">
            Decription :{' '}
            {description?.product_description
              ? description?.product_description
              : 'No description'}
          </div>
          <pre className="text">
            Charachteristics : <br />
            <br />
            {description?.product_characteristic}
          </pre>
          <div className="text">
            Composition : {description?.product_composition}
          </div>
          <div className="comment-button">
            {/* <button onClick={openModal}>Add comment</button> */}
            {/* {commentSent && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="2xl"
              style={{ color: '#63E6BE' }}
            />
          )} */}
          </div>
          {/* <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          style={customStyles}
          className="Modal"
          overlayClassName="Overlay"
        >
          <button onClick={closeModal}>x</button>
          <form onSubmit={handleSubmit} className="form-description">
            <textarea
              placeholder={'Your comment here ...'}
              className="textarea"
              name="comment"
              value={formData}
              onChange={(e) => setFormData(e.target.value)}
            ></textarea>
            <button type="submit">Send</button>
          </form>
        </Modal> */}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
