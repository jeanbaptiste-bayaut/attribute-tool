import './Modal.scss';

interface ModalProps {
  existingValues: {
    attribute: string;
    value: string;
  }[];
  noExistingAttributes: string[];
  attributeNotFoundList: string[];
  setList: React.Dispatch<
    React.SetStateAction<{
      existingValues: { attribute: string; value: string }[];
      noExistingAttributes: string[];
      attributeNotFoundList: string[];
    }>
  >;
}

function Modal({
  existingValues,
  noExistingAttributes,
  attributeNotFoundList,
  setList,
}: ModalProps) {
  return (
    <div className="list-container">
      {attributeNotFoundList.length > 0 && (
        <ul>
          <button
            onClick={() =>
              setList({
                existingValues: [],
                noExistingAttributes: [],
                attributeNotFoundList: [],
              })
            }
          >
            x
          </button>
          <h4>Attributes not existing :</h4>
          {attributeNotFoundList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {noExistingAttributes.length > 0 && (
        <ul>
          <button
            onClick={() =>
              setList({
                existingValues: [],
                noExistingAttributes: [],
                attributeNotFoundList: [],
              })
            }
          >
            x
          </button>
          <h4>Values not existing :</h4>
          {noExistingAttributes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {existingValues.length > 0 && (
        <ul>
          <button
            onClick={() =>
              setList({
                existingValues: [],
                noExistingAttributes: [],
                attributeNotFoundList: [],
              })
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
