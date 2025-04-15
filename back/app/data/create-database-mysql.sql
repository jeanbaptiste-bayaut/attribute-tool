
CREATE USER 'boardriders' IDENTIFIED BY 'boardriders';

CREATE DATABASE attributetool;

GRANT ALL PRIVILEGES ON attributetool.* TO 'boardriders';
FLUSH PRIVILEGES;