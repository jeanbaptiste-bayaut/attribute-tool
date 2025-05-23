-- Switch sur la base de données attributetool
USE attributetool;

-- Début de transaction
START TRANSACTION;

-- Supprimer les tables si elles existent déjà
DROP TABLE IF EXISTS product_has_attribute, comment, product, english, french, german, spanish, italian, portuguese, dutch, attribute, value, user;

-- Table user
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  product_index INT NOT NULL DEFAULT 0,
  locale_favorite VARCHAR(10) NOT NULL DEFAULT 'master',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Table product
CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  style VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),
  status BOOLEAN NOT NULL DEFAULT FALSE,
  season INT NOT NULL DEFAULT 1
);

-- Table English
CREATE TABLE english (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'master',
  label VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_description LONGTEXT,
  product_characteristic LONGTEXT,
  product_composition LONGTEXT,
  product_id INT NOT NULL,
  CONSTRAINT fk_english_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Table French
CREATE TABLE french (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'fr',
  label VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_description LONGTEXT,
  product_characteristic LONGTEXT,
  product_composition LONGTEXT,
  product_id INT NOT NULL,
  CONSTRAINT fk_french_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Table German
CREATE TABLE german (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'de',
  label VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_description LONGTEXT,
  product_characteristic LONGTEXT,
  product_composition LONGTEXT,
  product_id INT NOT NULL,
  CONSTRAINT fk_german_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Table Spanish
CREATE TABLE spanish (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'es',
  label VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_description LONGTEXT,
  product_characteristic LONGTEXT,
  product_composition LONGTEXT,
  product_id INT NOT NULL,
  CONSTRAINT fk_spanish_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Table Italian
CREATE TABLE italian (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'it',
  label VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_description LONGTEXT,
  product_characteristic LONGTEXT,
  product_composition LONGTEXT,
  product_id INT NOT NULL,
  CONSTRAINT fk_italian_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Table Portuguese
CREATE TABLE portuguese (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'pt',
  label VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_description LONGTEXT,
  product_characteristic LONGTEXT,
  product_composition LONGTEXT,
  product_id INT NOT NULL,
  CONSTRAINT fk_portuguese_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Table Dutch
CREATE TABLE dutch (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'nl',
  label VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_description LONGTEXT,
  product_characteristic LONGTEXT,
  product_composition LONGTEXT,
  product_id INT NOT NULL,
  CONSTRAINT fk_dutch_product FOREIGN KEY (product_id) REFERENCES product(id)
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

-- Table commentaire
CREATE TABLE comment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  comment LONGTEXT NOT NULL,
  english boolean NOT NULL DEFAULT FALSE,
  french boolean NOT NULL DEFAULT FALSE,
  german boolean NOT NULL DEFAULT FALSE,
  spanish boolean NOT NULL DEFAULT FALSE,
  italian boolean NOT NULL DEFAULT FALSE,
  portuguese boolean NOT NULL DEFAULT FALSE,
  dutch boolean NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_comment_product FOREIGN KEY (product_id) REFERENCES product(id)
)

-- Clé unique composite dans la table value
ALTER TABLE value ADD CONSTRAINT unique_name_attribute UNIQUE (name, attribute_id);

-- Fin de transaction
COMMIT;