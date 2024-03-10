const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS users CASCADE; 
    DROP TABLE IF EXISTS products CASCADE; 
    DROP TABLE IF EXISTS favorite_products CASCADE; 
   
    CREATE TABLE users(
        id UUID PRIMARY KEY ,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) 
    );

    CREATE TABLE products(
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
    );

    CREATE TABLE favorite_products(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT user_product_unique UNIQUE (user_id, product_id)
        );
    `;

    await client.query(SQL);
};

// creates a product in the database and returns the created record
const createProduct = async ({ name }) => {
    const SQL = `
   INSERT INTO products(id, name) VALUES($1,$2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);

    return response.rows[0];
};
//  creates a user in the database and returns the created record
const createUser = async ({ username, password }) => {
    const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *   
    `;

    const response = await client.query(SQL, [
        uuid.v4(),
        username,
        await bcrypt.hash(password, 5),
    ]);
    return response.rows[0];
};
// creates a favorite product in the database and return the created record
const createFavorite = async ({ user_id, product_id }) => {
    const SQL = `
    INSERT INTO favorite_products(id, user_id, product_id) VALUES($1,$2,$3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);

    return response.rows[0];
};

// fetchUsers - fetches all the users
const fetchUsers = async () => {
    const SQL = `
    SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
};
// fetchProducts - fetches all the products
const fetchProducts = async () => {
    const SQL = `
    SELECT * FROM products;
    `;
    const response = await client.query(SQL);

    return response.rows;
};

// fetchFavorites - fetches all the favorite products
const fetchFavorites = async () => {
    const SQL = `
    SELECT * FROM favorite_products;
    `;

    const response = await client.query(SQL);

    return response.rows;
};

// destroyFavorite - removes favorite products

const destroyFavorite = async ({ id, user_id }) => {
    const SQL = `
      DELETE FROM favorite_products
      WHERE id = $1 AND user_id = $2
    `;
    await client.query(SQL, [id, user_id]);
};

module.exports = {
    client,
    createTables,
    createProduct,
    createUser,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite,
};
