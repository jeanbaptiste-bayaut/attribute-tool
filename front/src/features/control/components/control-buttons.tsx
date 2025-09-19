import {
  patchProductAttributeStatus,
  patchProductStatus,
} from '../api/patch-status';
import useAttributes from '../stores/useAttributes';
import useProducts from '../stores/useProducts';

const ControlButtons = () => {
  const { index, products } = useProducts();
  const { attributes } = useAttributes();

  const submitChanges = () => {
    const product = products[index];
    patchProductAttributeStatus(product, attributes);
    patchProductStatus(product);
  };
  return (
    <div className="control-buttons">
      <button className="secondary-btn">Reset</button>
      <button className="secondary-btn" onClick={submitChanges}>
        Submit
      </button>
    </div>
  );
};
export default ControlButtons;
