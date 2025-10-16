import useUpload from '../stores/uploadStore';

export default function UploadModal() {
  const { list, resetList } = useUpload();

  return (
    <div className="list-container">
      {list?.valueNotFoundList?.length > 0 && (
        <ul>
          <button onClick={() => resetList()}>x</button>
          <h4>Values not existing :</h4>
          {list.valueNotFoundList.map((item, index) => (
            <li key={index}>
              {item.attribute} : {item.value}
            </li>
          ))}
        </ul>
      )}
      {list?.attributeNotFoundList?.length > 0 && (
        <ul>
          <button onClick={() => resetList()}>x</button>
          <h4>Attributes not found :</h4>
          {list.attributeNotFoundList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {list?.productNotFoundList?.length > 0 && (
        <ul>
          <button onClick={() => resetList()}>x</button>
          <h4>Products not found :</h4>
          {list.productNotFoundList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
