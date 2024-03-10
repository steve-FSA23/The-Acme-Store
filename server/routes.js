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

router.get("/users", async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (error) {
        next(error);
    }
});

module.exports = router;
