import CoreDataMapper from './core.datamapper.js';

export default class ProductDataMapper extends CoreDataMapper {
  static tableName = 'product';

  static async findAllProducts(brand, season) {
    const result = await this.client.query(
      `
      SELECT "product"."id" as "product_id", 
      "product"."style" as "product_style",
      "product"."color" as "product_color", 
      "product"."name" as "product_name", 
      "description"."description" as "product_description",
      "product"."image_url" as "image_url"
      FROM "product"
      JOIN "description" ON "product"."description_id" = "description"."id"
      JOIN "product_has_attribute" ON "product_has_attribute"."product_id" = "product"."id"
      JOIN "value" ON "product_has_attribute"."value_id" = "value"."id"
      WHERE "product"."status" = 'false'
      AND "product"."season"=$1
      AND "value"."name"=$2;`,
      [season, brand]
    );
    const { rows } = result;

    return rows;
  }

  static async findProductWithAttributeByPk(id) {
    const result = await this.client.query(
      `SELECT "product"."id" as "product_id", "product"."style" as "product_style", "product"."name" as "product_name", "description"."description" as "product_description",
      "attribute"."name" as "attribute_name", "value"."name" as "value_name", "product"."image_url" as "image_url" 
      FROM "product"
      JOIN "description" ON "product"."description_id" = "description"."id"
      JOIN "product_has_attribute" ON "product"."id" = "product_has_attribute"."product_id"
      JOIN "attribute" ON "product_has_attribute"."attribute_id" = "attribute"."id"
      JOIN "value" ON "product_has_attribute"."value_id" = "value"."id"
      WHERE "product"."id" = $1`,
      [id]
    );
    const { rows } = result;
    return rows;
  }

  static async switchProductStatus(id) {
    const result = await this.client.query(
      `UPDATE "product" SET "status" = TRUE
      WHERE "id" = $1 RETURNING "product"."style";`,
      [id]
    );
    return result.rows[0];
  }

  static async switchAttributeValueStatus(id, attributeId, valueId) {
    const result = await this.client.query(
      `UPDATE "product_with_attribute" SET "status" = FALSE
      WHERE "id" = $1 
      AND "attribute_id"= $2
      AND "value_id"= $3
      RETURNING "product_with_attribute"."product_id";`,
      [id, attributeId, valueId]
    );
    return result.rows[0];
  }
}
