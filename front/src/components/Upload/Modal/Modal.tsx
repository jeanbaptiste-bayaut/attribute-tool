import './Modal.scss';

interface ModalProps {
  list: {
    attribute: string;
    value: string;
  }[];
  setList: React.Dispatch<
    React.SetStateAction<{ attribute: string; value: string }[]>
  >;
}

function Modal({ list, setList }: ModalProps) {
  return (
    <div className="list-container">
      <ul>
        <button onClick={() => setList([])}>x</button>
        <h4>Values not found :</h4>
        {list.map((item, index) => (
          <li key={index}>
            {item.attribute} : {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Modal;
