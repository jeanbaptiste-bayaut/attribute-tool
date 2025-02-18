import './ProductDetails.scss';
import { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import FetchImages from './fetchImages/fetchImages';

interface ProductDetailsProps {
  product: {
    product_name: string;
    product_style: string;
    product_color: string;
    product_description: string;
    image_url: string;
    brand_name: string;
  } | null;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '400px',
  },
};

Modal.setAppElement('#root');

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState('');

  if (!product) {
    // Si le produit n'est pas encore défini, on peut afficher un chargement ou rien
    return <div>Loading...</div>;
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    if (product?.product_style) {
      formJson['style'] = product.product_style;
    }

    try {
      const result = await axios.post(
        `${
          process.env.NODE_ENV === 'production'
            ? import.meta.env.VITE_API_URL
            : import.meta.env.VITE_API_URL_DEV
        }/api/descriptions/comment`,
        formJson
      );

      if (result.status === 200) {
        alert('Comment sent');
        setFormData('');
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const description = product.product_description
    .replace(/([A-Z][a-zA-Z ]+):/g, ';$1:')
    .split(';')
    .filter((line) => line);

  return (
    <div className="image-description">
      <FetchImages
        style={product.product_style}
        brand={product.brand_name}
        color={product.product_color}
      />
      <div className="title">
        <h3>
          {product.product_name} - {product.product_style} -{' '}
          {product.product_color}
        </h3>
      </div>
      <div className="description">
        <div className="text">
          {description[0] !== '0' ? (
            description.map((line, index) => <p key={index}>{line}</p>)
          ) : (
            <p>No description for this product</p>
          )}
        </div>
        <button onClick={openModal}>Add comment</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <button onClick={closeModal}>x</button>
          <form onSubmit={handleSubmit} className="form-description">
            <textarea
              placeholder="Your comment here ..."
              className="textarea"
              name="comment"
              value={formData}
              onChange={(e) => setFormData(e.target.value)}
            ></textarea>
            <button type="submit">Send</button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductDetails;
