import MenuBurger from '../MenuBurger/MenuBurger';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ControlPage.scss';
import ProductNavigation from '../ProductNavigation/ProductNavigation';
import ProductDetails from '../ProductDetails/ProductDetails';
import AttributeList from '../AttributeList/AttributeList';
import ActionButtons from '../ActionButtons/ActionButtons';

function ControlPage() {
  interface Product {
    product_id: string;
    product_name: string;
    product_style: string;
    product_color: string;
    product_description: string;
    image_url: string;
    brand_name: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [attributeList, setAttributeList] = useState([]);
  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  const [attributeListToEdit, setattributeListToEdit] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brands, setBrands] = useState([{ brand_name: '' }]);
  const [seasons, setSeasons] = useState([{ season_name: '' }]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedLocale, setSelectedLocale] = useState('master');
  const [validated, setValidated] = useState(false);
  const [failed, setFailed] = useState(false);

  const getImagesUrl = async (brand: string, season: string) => {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/products/${brand}/${season}`
    );
    result.data.map((product: Product) => {
      product.brand_name = brand;
    });

    setProducts(result.data);
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
    setCurrentIndex(0);
    getImagesUrl(selectedBrand, selectedSeason);
  };

  const handleChangeSelectBrand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleChangeSelectSeason = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSeason(e.target.value);
  };

  const handleChangeSelectLocale = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLocale(e.target.value);
  };

  const getAttributesList = async (index: number) => {
    const productId = products[index].product_id;

    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/attributes/${productId}`
    );
    setCheckedState(new Array(result.data.length).fill(true));
    setAttributeList(result.data);
  };

  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
    const inputFalse = updatedCheckedState.reduce(
      (list, currentState, index) => {
        if (!currentState) list.push(attributeList[index]);
        return list;
      },
      []
    );
    setattributeListToEdit(inputFalse);
  };

  const handleValidateButton = async () => {
    const productId = products[currentIndex].product_id;
    const result = await axios.patch(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/products/${productId}`
    );

    if (!result.data) {
      throw new Error(
        `le produit ${productId} n'a pas été mis à jour pour les valeurs`
      );
    }
    setValidated(true);

    setTimeout(() => {
      setValidated(false);
      getImagesUrl(selectedBrand, selectedSeason);
      setCurrentIndex(currentIndex + 1);
    }, 1000);
  };

  const handleFailButton = async () => {
    const productId = products[currentIndex].product_id;

    if (attributeListToEdit.length > 0) {
      try {
        const result = await axios.patch(
          `${
            process.env.NODE_ENV === 'production'
              ? import.meta.env.VITE_API_URL
              : import.meta.env.VITE_API_URL_DEV
          }/api/attributes/status`,
          attributeListToEdit
        );

        if (!result.data) {
          throw new Error(
            `le produit ${productId} n'a pas été mis à jour pour les valeurs`
          );
        }

        setFailed(true);

        setTimeout(() => {
          setFailed(false);
          setattributeListToEdit([]);
          getImagesUrl(selectedBrand, selectedSeason);
          setCurrentIndex(currentIndex + 1);
        }, 1000);
      } catch (error) {
        alert(
          `Erreur lors de la mise à jour du produit ${products[currentIndex].product_name}`
        );
        throw new Error(String(error));
      }
    } else {
      alert(
        `Aucun valeur n'a été sélectionnée pour le produit ${products[currentIndex].product_name}`
      );
    }
  };

  useEffect(() => {
    getBrands();
    getSeasons();
  }, []);

  useEffect(() => {
    if (products.length > 0) getAttributesList(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, currentIndex]);

  return (
    <>
      <header>
        <div className="header-container">
          <MenuBurger />
          <form onSubmit={handleFilterSubmit} className="filter-form">
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
            <select name="locale" onChange={handleChangeSelectLocale}>
              <option defaultValue="">Select a locale</option>
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="german">German</option>
              <option value="italian">Italian</option>
              <option value="portuguese">Portuguese</option>
              <option value="dutch">Dutch</option>
            </select>
            <button type="submit">Filter</button>
          </form>
        </div>
        <p>{products.length} product(s) to validate</p>
      </header>

      <div className="grid-container">
        <ProductDetails
          product={products[currentIndex]}
          selectedLocale={selectedLocale}
          setSelectedLocale={setSelectedLocale}
        />
        <AttributeList
          attributes={attributeList}
          checkedState={checkedState}
          handleOnChange={handleOnChange}
        />
        <ProductNavigation
          prevProduct={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          nextProduct={() =>
            setCurrentIndex((prev) => Math.min(products.length - 1, prev + 1))
          }
          currentIndex={currentIndex}
          totalProducts={products.length}
        />
        <ActionButtons
          onValidate={handleValidateButton}
          onFail={handleFailButton}
          validated={validated}
          failed={failed}
        />
      </div>
    </>
  );
}

export default ControlPage;
