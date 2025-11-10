import useSeasons from '../stores/useSeasons';
import useBrands from '../stores/useBrands';
import useAttributes from '../stores/useAttributes';
import { useEffect, useRef, useState } from 'react';
import { getParentTypes, getSeasons } from '../api/get-brands-seasons';
import { getBrands } from '../api/get-brands-seasons';
import { getAttributes } from '../api/get-attributes';
import { getProducts } from '../api/get-products';
import { Form } from '../types/product.schemas';
import useProducts from '../stores/useProducts';
import { FieldErrors, useForm } from 'react-hook-form';
import { filterProductList } from '../services/filterProductList';
import useImages from '../stores/useImages';
import { Toast } from 'primereact/toast';

const ControlForm = () => {
  const { seasons, setAllSeasons } = useSeasons();
  const { brands, setAllBrands } = useBrands();
  const { parent_type, setParentType } = useAttributes();
  const { setProductIndex, setAllProducts } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const { setIndexImage } = useImages();
  const toast = useRef<Toast>(null);

  const { register, handleSubmit, watch } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      brand_name: '',
      season_name: '',
      parent_type: '',
    },
  });

  const selectedBrand = watch('brand_name');
  const selectedSeason = parseInt(watch('season_name'));

  useEffect(() => {
    const fetchParentTypes = async () => {
      if (selectedBrand && selectedSeason) {
        try {
          const types = await getParentTypes(selectedBrand, selectedSeason);

          setParentType(types);
        } catch (error) {
          console.error('Error fetching parent types:', error);
        }
      } else {
        setParentType([]);
      }
    };
    fetchParentTypes();
  }, [selectedBrand, selectedSeason, setParentType, setAllProducts]);

  const onSubmit = async (data: Form) => {
    setIndexImage(0);
    setProductIndex(0);

    try {
      const fetchedProducts = await getProducts(
        data.brand_name,
        data.season_name
      );

      const filteredProducts = filterProductList(
        fetchedProducts,
        data.parent_type
      );

      setAllProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products on form submit:', error);
    }
  };

  const showToast = () => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a parent type before submitting.',
      life: 3000,
    });
  };

  const onInvalid = (errors: FieldErrors<Form>) => {
    if (errors.parent_type) {
      showToast();
    }
  };

  useEffect(() => {
    // Fetch seasons, brands, attributes from API and set them
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setParentType(await getAttributes('parent_type'));
        setAllBrands(await getBrands());
        setAllSeasons(await getSeasons());
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, [setAllSeasons, setAllBrands, setParentType]);

  return (
    <>
      <Toast ref={toast} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form
          className="control-form"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
          <select {...register('brand_name', { required: true })}>
            <option value="">Select Brand</option>
            {brands.map((brand, index: number) => (
              <option key={`${brand}-${index}`} value={brand.brand_name}>
                {brand.brand_name}
              </option>
            ))}
          </select>
          <select {...register('season_name', { required: true })}>
            <option value="">Select Season</option>
            {seasons.map((season, index: number) => (
              <option key={`${season}-${index}`} value={season.season_name}>
                {season.season_name}
              </option>
            ))}
          </select>
          <select {...register('parent_type', { required: true })}>
            <option value="">Select Parent Type</option>
            {parent_type.map((type, index: number) => (
              <option key={`${type}-${index}`} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
          <button>Fetch Products</button>
        </form>
      )}
    </>
  );
};

export default ControlForm;
