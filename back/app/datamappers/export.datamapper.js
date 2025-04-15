import CoreDataMapper from './core.datamapper.js';

export default class ExportDataMapper extends CoreDataMapper {
  static tableName = '';

  static async findStyleWithAttributeToEdit(brand, season) {
    const [result] = await this.client.query(
      `SELECT product.id as product_id, 
product.style as product_style, 
product.name as product_name, 
description.description as product_description,
product.image_url as image_url 
FROM product
JOIN description ON product.description_id = description.id
JOIN product_has_attribute ON product_has_attribute.product_id = product.id
JOIN value ON product_has_attribute.value_id = value.id
WHERE product_has_attribute.status = 'false'
AND value.name=?
AND product.season=?;`,
      [brand, season]
    );

    return result;
  }

  static async findStyleWithDescriptionComment(brand, season) {
    const [result] = await this.client.query(
      `SELECT
        product.style as style,
        product.name as name,
        description.description as description,
        description.comment as comment,
        value.name as brand_name,
        product.season as season
        FROM product_has_attribute
        JOIN product ON product.id = product_has_attribute.product_id
        JOIN description ON product.description_id = description.id
        JOIN attribute ON product_has_attribute.attribute_id = attribute.id
        JOIN value ON product_has_attribute.value_id = value.id
        WHERE commentIS NOT NULL
        AND value.name=?
        AND product.season=?;`,
      [brand, season]
    );

    return result;
  }
}
