import { useEffect } from 'react';
import { clearList } from '../services/uploadService';
import useUpload from '../stores/uploadStore';

export default function UploadModal() {
  const { list, setList } = useUpload();

  useEffect(() => {
    {
      console.log('list in modal', list);
    }
  }, [list]);
  return (
    <div className="list-container">
      {list.noExistingAttributes.length > 0 && (
        <ul>
          <button onClick={() => clearList(setList)}>x</button>
          <h4>Attributes not existing :</h4>
          {list.noExistingAttributes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
