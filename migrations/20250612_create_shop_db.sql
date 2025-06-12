CREATE DATABASE IF NOT EXISTS shop_online
USE shop_online

CREATE TABLE products (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    type_product INT,
    price INT,
    colour VARCHAR(100),
    FOREIGN KEY (type_product) REFERENCES type_products(id)
)

CREATE TABLE type_products (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
)

CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    surname VARCHAR(100),
    birth_date DATE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100)
)

CREATE TABLE orders (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    status ENUM('created', 'in process', 'completed'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)