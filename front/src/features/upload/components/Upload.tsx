import React, { useRef, useState } from 'react';
import '../../../styles/components/_upload.scss';
import { CSVLink } from 'react-csv';
import Loader from '../../../components/Loader/Loader';
import UploadModal from './UploadModal';
import { uploadFile } from '../api/uploadApi';
import { AxiosError } from 'axios';
import useUpload from '../stores/uploadStore';
import { UploadListState } from '../types/upload.schemas';
import { Toast } from 'primereact/toast';

export default function UploadFeature() {
  const [file, setFile] = useState<File | null>(null);
  const [statusUpload, setStatusUpload] = useState(false);
  const { list, setList } = useUpload();

  const toast = useRef<Toast>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement>,
    endpoint: string,
    fileParam: File | null
  ) => {
    e.preventDefault();
    setStatusUpload(true);

    if (!fileParam) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append(`${endpoint.replace(/\//g, '-')}`, fileParam);

    try {
      const upload: UploadListState = await uploadFile(endpoint, formData);

      setList(upload);
      setStatusUpload(false);
      showSuccess(endpoint);
      setFile(null);

      (
        document.getElementById(
          `${endpoint.replace(/\//g, '-')}`
        ) as HTMLFormElement
      )?.reset();
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as
        | { message?: string }
        | undefined;
      const errorMessage = data?.message ?? axiosError.message;
      alert(`Error uploading the ${endpoint} file: \n ${errorMessage}`);
      setStatusUpload(false);
      throw new Error(`Error uploading the ${endpoint} file: ${errorMessage}`);
    }
  };

  const showSuccess = (endpoint: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: `File ${endpoint} uploaded successfully`,
      life: 3000,
    });
  };

  return (
    <div className="upload-content-container">
      <Toast ref={toast} />
      {/* <MenuBurger /> */}
      <h1>Upload data</h1>
      {statusUpload && <Loader />}
      <div className="upload-container">
        {list?.attributeNotFoundList?.length > 0 ||
        list?.valueNotFoundList?.length > 0 ||
        (list?.productNotFoundList?.length > 0 && !statusUpload) ? (
          <UploadModal />
        ) : null}

        {/* forms copied from original component - kept structure and ids */}
        <form
          id="products"
          className="products"
          encType="multipart/form-data"
          onSubmit={(e) => handleUpload(e, 'products', file)}
        >
          <CSVLink
            data={[
              ['style', 'color', 'name', 'image_url', 'season'],
              [
                'ELBSF00180',
                'bllk',
                'SBXE PREVENT PO Y',
                'https://s3.amazonaws.com/images.boardriders.com/bi/element/large/elbsf00180_ghe0.png',
                '251',
              ],
            ]}
            filename={`import-products-template.csv`}
            className="download"
            separator={';'}
          >
            Download Products template
          </CSVLink>
          <label htmlFor="products" className="label-products">
            Upload products
          </label>
          <input
            type="file"
            className="file-products"
            id="products-csv"
            name="products-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-products">Upload</button>
        </form>

        <form
          id="descriptions"
          className="descriptions"
          onSubmit={(e) => handleUpload(e, 'descriptions', file)}
        >
          <CSVLink
            data={[
              [
                'ModesCode',
                'LabelWeb',
                'ActiveLanguage',
                'DescriptionLOng',
                'Characteristics',
                'composition',
                'type',
              ],

              [
                'ELBSF00180',
                'HIGHLINE32CZ (BFG)',
                'master',
                "The Highline 32L CZ is a versatile backpack designed for everyday use and outdoor adventures. With its spacious main compartment, multiple pockets, and comfortable straps, it offers ample storage and easy organization for all your essentials. Whether you're heading to work, school, or a weekend hike, this backpack is built to keep up with your active lifestyle.",
                '__Collection:__ HIGHLINE PRO IMPACT',
                '93.2% Recycled Nylon, 6.8% Spandex',
                'Chest Zip Wetsuit',
              ],
            ]}
            filename={`import-descriptions-template.csv`}
            className="download"
            separator={';'}
          >
            Download Descriptions template
          </CSVLink>
          <label htmlFor="descriptions" className="label-descriptions">
            Upload descriptions
          </label>
          {/* <table
            className="csv-structure-table"
            style={{ transform: 'scale(0.8)' }}
          >
            <thead>
              <tr>
                <th>ModesCode</th>
                <th>LabelWeb</th>
                <th>ActiveLanguage</th>
                <th>DescriptionLong</th>
                <th>Characteristics</th>
                <th>Composition</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ELBSF00180</td>
                <td>HIGHLINE32CZ (BFG)</td>
                <td>master</td>
                <td>The Highline 32L CZ is a versatile backpack...</td>
                <td>__Collection:__ HIGHLINE PRO IMPACT</td>
                <td>93.2% Recycled Nylon, 6.8% Spandex</td>
                <td>Chest Zip Wetsuit</td>
              </tr>
            </tbody>
          </table> */}
          <input
            type="file"
            className="file-descriptions"
            id="descriptions-csv"
            name="descriptions-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-descriptions">Upload</button>
        </form>

        <form
          id="attributes"
          className="attributes"
          onSubmit={(e) => handleUpload(e, 'attributes', file)}
        >
          <CSVLink
            data={[['name'], ['parent_type'], ['category'], ['fit']]}
            filename={`import-attributes-template.csv`}
            className="download"
            separator={';'}
          >
            Download Attributes template
          </CSVLink>
          <label htmlFor="attributes" className="label-attributes">
            Upload attributes
          </label>
          <input
            type="file"
            className="file-attributes"
            id="attributes-csv"
            name="attributes-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-attributes">Upload</button>
        </form>

        <form
          id="attributes-values"
          className="values"
          onSubmit={(e) => handleUpload(e, 'attributes/values', file)}
        >
          <CSVLink
            data={[
              ['attribute', 'value1', 'value2', 'value3', 'value4'],
              ['category', 'accessories', 'clothing', 'snow'],
              ['parent_type', 'bag', 'backpack', 'beanie', 'belt'],
            ]}
            filename={`import-values-template.csv`}
            className="download"
            separator={';'}
          >
            Download Values template
          </CSVLink>
          <label htmlFor="values" className="label-values">
            Upload values
          </label>
          <input
            type="file"
            className="file-values"
            id="values-csv"
            name="values-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-values">Upload</button>
        </form>

        <form
          id="products-attributes-values"
          className="products-attributes"
          onSubmit={(e) => handleUpload(e, 'products/attributes/values', file)}
        >
          <CSVLink
            data={[
              [
                'style',
                'division_1',
                'category_1',
                'gender_1',
                'parent_type_1',
                'subtype_1',
                'subtype_2',
                'fit_1',
              ],
              [
                'ELBSF00180',
                'element',
                'clothing',
                'men',
                't-shirt',
                'short_sleeve',
                'long_sleeve',
              ],
              [
                'ELBSF00181',
                'element',
                'clothing',
                'men',
                'short',
                'hybrid',
                'side_pocket',
                'regular',
              ],
            ]}
            filename={`import-assignment-template.csv`}
            className="download"
            separator={';'}
          >
            Download attributes template
          </CSVLink>
          <label
            htmlFor="products-attributes"
            className="label-products-attributes"
          >
            Assign attributes to product
          </label>
          <input
            type="file"
            className="file-products-attributes"
            id="products-attributes-csv"
            name="products-attributes-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-products-attributes">Upload</button>
        </form>
      </div>
    </div>
  );
}
