import './AttributeList.scss';

interface AttributeList {
  attribute_name: string;
  value_name: string;
}

interface AttributeListProps {
  attributes: AttributeList[];
  checkedState: boolean[];
  handleOnChange: (index: number) => void;
}

const AttributeList = ({
  attributes,
  checkedState,
  handleOnChange,
}: AttributeListProps) => (
  <div className="attributes">
    <ul>
      {attributes.map((attribute, index) => (
        <li key={index} className="attribute-list-container">
          <span>{attribute.attribute_name}</span>
          <span>{attribute.value_name}</span>
          <label className="switch">
            <input
              type="checkbox"
              id={`switch-${index}`}
              name={`${attribute.attribute_name}:${attribute.value_name}`}
              value={`${attribute.attribute_name}:${attribute.value_name}`}
              checked={checkedState[index]}
              onChange={() => handleOnChange(index)}
            />
            <span className="slider"></span>
          </label>
        </li>
      ))}
    </ul>
  </div>
);

export default AttributeList;
