import useSeasons from '../stores/useSeasons';
import useBrands from '../stores/useBrands';
import useAttributes from '../stores/useAttributes';
import { useEffect, useState } from 'react';
import { getParentTypes, getSeasons } from '../api/get-brands-seasons';
import { getBrands } from '../api/get-brands-seasons';
import { getAttributes } from '../api/get-attributes';
import { getProducts } from '../api/get-products';
import { Form } from '../types/product.schemas';
import useProducts from '../stores/useProducts';
import { useForm } from 'react-hook-form';
import { filterProductList } from '../services/filterProductList';

const ControlForm = () => {
  const { seasons, setAllSeasons } = useSeasons();
  const { brands, setAllBrands } = useBrands();
  const { parent_type, setParentType } = useAttributes();
  const { setAllProducts } = useProducts();
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, watch } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      brand_name: '',
      season_name: '',
      parent_type: '',
    },
  });

  const selectedBrand = watch('brand_name');

  useEffect(() => {
    const fetchParentTypes = async () => {
      if (selectedBrand) {
        try {
          const types = await getParentTypes(selectedBrand);
          setParentType(types);
        } catch (error) {
          console.error('Error fetching parent types:', error);
        }
      } else {
        setParentType([]);
      }
    };
    fetchParentTypes();
  }, [selectedBrand, setParentType, setAllProducts]);

  const onSubmit = async (data: Form) => {
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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form className="control-form" onSubmit={handleSubmit(onSubmit)}>
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
