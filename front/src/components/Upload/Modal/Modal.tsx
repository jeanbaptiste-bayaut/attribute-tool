import './Modal.scss';

interface ModalProps {
  existingValues: {
    attribute: string;
    value: string;
  }[];
  noExistingAttributes: string[];
  setList: React.Dispatch<
    React.SetStateAction<{
      existingValues: { attribute: string; value: string }[];
      noExistingAttributes: string[];
    }>
  >;
}

function Modal({ existingValues, noExistingAttributes, setList }: ModalProps) {
  return (
    <div className="list-container">
      {noExistingAttributes.length > 0 && (
        <ul>
          <button
            onClick={() =>
              setList({ existingValues: [], noExistingAttributes: [] })
            }
          >
            x
          </button>
          <h4>Attributes not existing :</h4>
          {noExistingAttributes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {existingValues.length > 0 && (
        <ul>
          <button
            onClick={() =>
              setList({ existingValues: [], noExistingAttributes: [] })
            }
          >
            x
          </button>
          <h4>Existing Values :</h4>
          {existingValues.map((item, index) => (
            <li key={index}>
              {item.attribute} : {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Modal;
