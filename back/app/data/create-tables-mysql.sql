-- Switch sur la base de données attributetool
USE attributetool;

-- Début de transaction
START TRANSACTION;

-- Supprimer les tables si elles existent déjà
DROP TABLE IF EXISTS product_has_attribute, product, description, attribute, value;

-- Table attribute
CREATE TABLE attribute (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Table value
CREATE TABLE value (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  attribute_id INT NOT NULL,
  CONSTRAINT fk_value_attribute FOREIGN KEY (attribute_id) REFERENCES attribute(id)
);

-- Table description
CREATE TABLE description (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description LONGTEXT NOT NULL,
  style VARCHAR(10) NOT NULL UNIQUE,
  comment LONGTEXT
);

-- Table product
CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  style VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),
  description_id INT UNIQUE,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  season INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_product_description FOREIGN KEY (description_id) REFERENCES description(id)
);

-- Table product_has_attribute
CREATE TABLE product_has_attribute (
  product_id   INT,
  attribute_id INT,
  value_id     INT,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_pha_product FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_pha_attribute FOREIGN KEY (attribute_id) REFERENCES attribute(id),
  CONSTRAINT fk_pha_value FOREIGN KEY (value_id) REFERENCES value(id),
  CONSTRAINT unique_attribute_value UNIQUE (product_id, attribute_id, value_id)
);

-- Clé unique composite dans la table value
ALTER TABLE value ADD CONSTRAINT unique_name_attribute UNIQUE (name, attribute_id);

-- Fin de transaction
COMMIT;