import {
  patchProductAttributeStatus,
  patchProductStatus,
} from '../api/patch-status';
import useAttributes from '../stores/useAttributes';
import useProducts from '../stores/useProducts';

const ControlButtons = () => {
  const { index, products, setProductIndex } = useProducts();
  const { attributes } = useAttributes();

  const submitChanges = () => {
    const product = products[index];
    patchProductAttributeStatus(product, attributes);
    patchProductStatus(product);
    setProductIndex(index + 1);
  };
  return (
    <div className="control-buttons">
      <button className="secondary-btn">Reset</button>
      <button className="secondary-btn" onClick={submitChanges}>
        Submit
      </button>
      <button
        className="secondary-btn"
        onClick={() => setProductIndex(index - 1)}
      >
        Previous
      </button>
      <button
        className="secondary-btn"
        onClick={() => setProductIndex(index + 1)}
      >
        Next
      </button>
    </div>
  );
};
export default ControlButtons;
