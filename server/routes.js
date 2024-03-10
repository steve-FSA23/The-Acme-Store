const express = require("express");
const router = express.Router();

const {
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createUser,
    createProduct,
    createFavorite,
    destroyFavorite,
} = require("./db");

// GET - Returns an array of users
router.get("/users", async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (error) {
        next(error);
    }
});

// GET - Returns an array of products
router.get("/products", async (req, res, next) => {
    try {
        res.send(await fetchProducts());
    } catch (error) {
        next(error);
    }
});

// GET - Returns an array of products
router.get("/favoriteproducts", async (req, res, next) => {
    try {
        res.send(await fetchFavorites());
    } catch (error) {
        next(error);
    }
});

// POST - Create a new user
router.post("/signup", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const newUser = await createUser({ username, password });

        res.status(201).send(newUser);
    } catch (error) {
        next(error);
    }
});

// POST - Create a new product
router.post("/createproduct", async (req, res, next) => {
    try {
        const { name } = req.body;

        const newProduct = await createProduct({ name });

        res.status(201).send(newProduct);
    } catch (error) {
        next(error);
    }
});

// POST - Create a favorite product
router.post("/users/:id/favorites", async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const { product_id } = req.body;

        const favoriteProduct = await createFavorite({ user_id, product_id });

        res.status(201).send(favoriteProduct);
    } catch (error) {
        next(error);
    }
});

// Delete - Removes favorite products
router.delete("/users/:userId/favorites/:id", async (req, res, next) => {
    try {
        const { userId, id } = req.params;

        await destroyFavorite({ id, user_id: userId });

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});
module.exports = router;
