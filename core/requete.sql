// Creation de la bdd :
CREATE DATABASE mydb ;

// Les tables de la bdd :
// la table users :

CREATE TABLE users (
id int ,
username VARCHAR(255),
fullname VARCHAR(255),
email VARCHAR(255),
password VARCHAR(255),
PRIMARY KEY (id));