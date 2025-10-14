BEGIN;

DROP TABLE IF EXISTS "product_has_attribute", "product", "description", "attribute", "value";

CREATE TABLE "attribute" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "value" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "attribute_id" INT NOT NULL,
  FOREIGN KEY ("attribute_id") REFERENCES "attribute" ("id")
);

CREATE TABLE "description" (
  "id" SERIAL PRIMARY KEY,
  "description" TEXT NOT NULL,
  "style" VARCHAR(10) NOT NULL UNIQUE,
  "comment" TEXT
);

CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "style" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "image_url" TEXT,
  "description_id" INT UNIQUE,
  "status" TEXT NOT NULL DEFAULT FALSE,
  "season" TEXT NOT NULL DEFAULT 01,
  FOREIGN KEY ("description_id") REFERENCES "description" ("id")
);

CREATE TABLE "product_has_attribute" (
  "product_id"   INT,
  "attribute_id" INT,
  "value_id" INT,
  "status" TEXT NOT NULL DEFAULT TRUE,
  FOREIGN KEY ("product_id") REFERENCES "product" ("id"),
  FOREIGN KEY ("attribute_id") REFERENCES "attribute" ("id"),
  FOREIGN KEY ("value_id") REFERENCES "value" ("id")
);

ALTER TABLE "value" ADD CONSTRAINT unique_name_attribute UNIQUE ("name", "attribute_id");
ALTER TABLE "product_has_attribute" ADD CONSTRAINT unique_attribute_value UNIQUE ("product_id", "attribute_id", "value_id");

COMMIT;

