export default class CoreDatamapper {
  static tableName = null;
  static client = null;

  static init(config) {
    this.client = config.client;
  }

  static async findAll() {
    const [result] = await this.client.query(
      `SELECT * FROM ${this.tableName};`
    );
    return result;
  }

  static async findByName(name) {
    const [result] = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE name = ?;`,
      [name]
    );

    return result[0];
  }

  static async findByPk(id) {
    const [result] = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?;`,
      [id]
    );

    return result[0];
  }

  // static async create(input) {
  //   const columns = Object.keys(input).map((column) => `${column}`);
  //   const placeholders = Object.keys(input).map(() => `?`);
  //   const values = Object.values(input);

  //   const [result] = await this.client.query(
  //     `
  //           INSERT INTO ${this.tableName}
  //           (${columns})
  //           VALUES (${placeholders});
  //         `,
  //     [values]
  //   );

  //   return result;
  // }

  // static async update(id, input) {
  //   const fieldPlaceholders = Object.keys(input).map(
  //     (column, index) => `"${column}" = $${index + 1}`
  //   );
  //   const values = Object.values(input);

  //   const result = await this.client.query(
  //     `
  //         UPDATE ${this.tableName} SET
  //           ${fieldPlaceholders},
  //           updated_at = now()
  //         WHERE "id" = $${fieldPlaceholders.length + 1}
  //         RETURNING *
  //         `,
  //     [...values, id]
  //   );

  //   return result.rows[0];
  // }

  static async delete(id) {
    const [result] = await this.client.query(
      `DELETE FROM ${this.tableName} WHERE id = ?;`,
      [id]
    );

    return result;
  }
}
