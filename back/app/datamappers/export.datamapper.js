import CoreDataMapper from './core.datamapper.js';

export default class ExportDataMapper extends CoreDataMapper {
  static tableName = '';

  static async findStyleWithAttributeToEdit(season) {
    const [result] = await this.client.query(
      `SELECT 
        product.style as style,
        product.name as name,
        attribute.name as attribute,
        value.name as value
      FROM product_has_attribute
        JOIN product on product_has_attribute.product_id = product.id
        JOIN attribute on product_has_attribute.attribute_id = attribute.id
        JOIN value on product_has_attribute.value_id = value.id
      WHERE product_has_attribute.status = FALSE
        AND product.season=?;`,
      [season]
    );

    return result;
  }

  static async findStyleWithDescriptionComment(season) {
    const [result] = await this.client.query(
      `SELECT 
        product.season,
        product.style as style, 
        product.name as style_name,
        value.name as brand,
        description.description as description,
        description.comment as comment
      FROM product
        JOIN product_has_attribute on product.id = product_has_attribute.product_id
        JOIN attribute on product_has_attribute.attribute_id = attribute.id
        JOIN value on product_has_attribute.value_id = value.id
        JOIN description on product.description_id = description.id
      WHERE attribute.name = 'division'
        AND description.comment IS NOT NULL
        AND product.season = ?;`,
      [season]
    );

    return result;
  }
}
