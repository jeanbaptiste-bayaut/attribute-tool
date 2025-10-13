import { ExistingValue, UploadListState, SetUploadList } from '../types';
import { clearList } from '../services/uploadService';

interface UploadModalProps extends UploadListState {
  setList: SetUploadList;
}

export default function UploadModal({
  existingValues,
  noExistingAttributes,
  attributeNotFoundList,
  setList,
}: UploadModalProps) {
  return (
    <div className="list-container">
      {attributeNotFoundList.length > 0 && (
        <ul>
          <button onClick={() => clearList(setList)}>x</button>
          <h4>Attributes not existing :</h4>
          {attributeNotFoundList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {noExistingAttributes.length > 0 && (
        <ul>
          <button onClick={() => clearList(setList)}>x</button>
          <h4>Values not existing :</h4>
          {noExistingAttributes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {existingValues.length > 0 && (
        <ul>
          <button onClick={() => clearList(setList)}>x</button>
          <h4>Existing Values :</h4>
          {existingValues.map((item: ExistingValue, index: number) => (
            <li key={index}>
              {item.attribute} : {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
