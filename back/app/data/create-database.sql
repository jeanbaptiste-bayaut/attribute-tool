CREATE DATABASE "attribute-tool";
CREATE ROLE boardriders WITH LOGIN PASSWORD 'boardriders';
GRANT ALL PRIVILEGES ON DATABASE "attribute-tool" TO boardriders;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO boardriders;