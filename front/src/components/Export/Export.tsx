import './Export.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}-${date}-${year}`;
}

function Export() {
  const [stylesWithAttributesToEdit, setStylesWithAttributesToEdit] = useState(
    []
  );
  const [stylesWithDescriptionsComment, setStylesWithDescriptionsComment] =
    useState([]);
  const [brands, setBrands] = useState([{ brand_name: '' }]);
  const [seasons, setSeasons] = useState([{ season_name: '' }]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [activeFilter, setActiveFilter] = useState(false);

  const getStylesWithAttributesToEdit = async () => {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/export/attributes/${selectedBrand}/${selectedSeason}`
    );
    setStylesWithAttributesToEdit(result.data);
  };

  const getStylesWithDescriptionsComment = async () => {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/export/descriptions/${selectedBrand}/${selectedSeason}`
    );
    setStylesWithDescriptionsComment(result.data);
  };

  const getBrands = async () => {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/brands`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    setBrands(result.data);
  };

  const getSeasons = async () => {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/seasons`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    setSeasons(result.data);
  };

  const handleFilterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    getStylesWithAttributesToEdit();
    getStylesWithDescriptionsComment();
    setActiveFilter(true);
  };

  const handleChangeSelectBrand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleChangeSelectSeason = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSeason(e.target.value);
  };

  const [currentDate] = useState(getDate());

  useEffect(() => {
    getBrands();
    getSeasons();
  }, []);

  return (
    <div className="parent-container">
      <h1>Export</h1>
      <form onSubmit={handleFilterSubmit} className="filter-form-export">
        <select name="brand" onChange={handleChangeSelectBrand}>
          <option defaultValue="">Select a brand</option>
          {brands.map((brand) => (
            <option key={brand.brand_name} value={brand.brand_name}>
              {brand.brand_name}
            </option>
          ))}
        </select>
        <select name="season" onChange={handleChangeSelectSeason}>
          <option defaultValue="">Select a season</option>
          {seasons.map((season) => (
            <option key={season.season_name} value={season.season_name}>
              {season.season_name}
            </option>
          ))}
        </select>
        <button type="submit">Filter</button>
      </form>
      <div className="export-container">
        <div className="export-attributes">
          <h2>Export list of attributes to edit</h2>
          <CSVLink
            data={stylesWithAttributesToEdit}
            filename={`at-attributes-export${currentDate}.csv`}
            separator={';'}
            style={{ display: activeFilter ? 'block' : 'none' }}
          >
            Download me
          </CSVLink>
        </div>
        <div className="export-descriptions">
          <h2>Export list of descriptions to edit</h2>
          <CSVLink
            data={stylesWithDescriptionsComment}
            filename={`at-descriptions-export${currentDate}.csv`}
            separator={';'}
            style={{ display: activeFilter ? 'block' : 'none' }}
          >
            Download me
          </CSVLink>
        </div>
      </div>
    </div>
  );
}

export default Export;
