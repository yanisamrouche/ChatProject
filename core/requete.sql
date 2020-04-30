// Creation de la bdd :
CREATE DATABASE mydb ;

// Les tables de la bdd :
// la table users :

CREATE TABLE users (
id int AUTO_INCREMENT ,
username VARCHAR(255),
fullname VARCHAR(255),
email VARCHAR(255),
password VARCHAR(255),
PRIMARY KEY (id));


//table pseudonyme
CREATE TABLE pseudonyme
 (id int AUTO_INCREMENT,
 pseudo VARCHAR(255),
  PRIMARY KEY (id));

// table messages
CREATE TABLE messages (
id int AUTO_INCREMENT,
pseudo VARCHAR(255),
 message VARCHAR(255),
 PRIMARY KEY (id));

