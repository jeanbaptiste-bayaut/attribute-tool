import CoreDataMapper from './core.datamapper.js';
import bcrypt from 'bcrypt';

export default class UserDataMapper extends CoreDataMapper {
  static tableName = 'user';

  static async getUserById(id) {
    const [result] = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?;`,
      [id]
    );
    return result[0];
  }
  static async getAllUsers() {
    const [result] = await this.client.query(
      `SELECT * FROM ${this.tableName};`
    );
    return result;
  }

  static async getUserByEmail(email) {
    const [result] = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE email = ?;`,
      [email]
    );
    return result[0];
  }

  static async createUser(email, password) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;

    await this.client.query(
      `INSERT INTO ${this.tableName} (email, password) 
      VALUES (?, ?);`,
      [email, password]
    );
    return { message: `User with email: ${email} created successfully` };
  }

  static async login(email, password) {
    const [existingUser] = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE email = ?;`,
      [email]
    );
    if (!existingUser[0]) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser[0].password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    existingUser[0].password = undefined;

    return {
      email: existingUser[0].email,
      id: existingUser[0].id,
      product_index: existingUser[0].product_index,
    };
  }

  static async getIndexByUser(id) {
    const [result] = await this.client.query(
      `SELECT product_index FROM ${this.tableName} WHERE id = ?;`,
      [id]
    );
    return result[0];
  }

  static async updateIndexByUser(index, id) {
    const [result] = await this.client.query(
      `UPDATE user 
      SET product_index = ? 
      WHERE id = ?;`,
      [index, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }
    const [productIndex] = await this.client.query(
      `SELECT product_index FROM ${this.tableName} WHERE id = ?;`,
      [id]
    );

    if (index.length === 0) {
      throw new Error('User not found');
    }

    return productIndex[0];
  }

  static async updateUserLocaleFavorite(locale, id) {
    const [result] = await this.client.query(
      `UPDATE ${this.tableName} SET locale_favorite = ? 
      WHERE id = ?;`,
      [locale, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }

    return { locale_favorite: locale };
  }
}
