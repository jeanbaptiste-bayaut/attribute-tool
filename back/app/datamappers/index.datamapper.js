import { client } from '../client/pg.config.client.js';
import ProductDataMapper from './product.datamapper.js';
import DescriptionDataMapper from './description.datamapper.js';
import AttributeDataMapper from './attribute.datamapper.js';
import UploadProductDataMapper from './uploadProduct.datamapper.js';
import ValueDataMapper from './value.datamapper.js';
import ProductHasAttributeDataMapper from './product_has_attribute.datamapper.js';
import ExportDataMapper from './export.datamapper.js';

ProductDataMapper.init({ client });
DescriptionDataMapper.init({ client });
AttributeDataMapper.init({ client });
UploadProductDataMapper.init({ client });
ValueDataMapper.init({ client });
ProductHasAttributeDataMapper.init({ client });
ExportDataMapper.init({ client });

export {
  ProductDataMapper,
  DescriptionDataMapper,
  AttributeDataMapper,
  UploadProductDataMapper,
  ValueDataMapper,
  ProductHasAttributeDataMapper,
  ExportDataMapper,
};
