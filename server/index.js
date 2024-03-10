const {
    client,
    createTables,
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite,
} = require("./db");

const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

const init = async () => {
    try {
        await client.connect();
        console.log("Connected to database!");

        await createTables();
        console.log("Tables Created 📊!");

        const [moe, lucy, steve, tshirt, dress, perfume, jeans] =
            await Promise.all([
                createUser({ username: "moe", password: "password123" }),
                createUser({ username: "lucy", password: "password123" }),
                createUser({ username: "steve", password: "password123" }),

                createProduct({ name: "t-shirt" }),
                createProduct({ name: "dress" }),
                createProduct({ name: "perfume" }),
                createProduct({ name: "jeans" }),
            ]);

        const users = await fetchUsers();
        console.log("My Users: ", users);

        const products = await fetchProducts();
        console.log("My Products: ", products);

        const favoriteProduct = await Promise.all([
            createFavorite({ user_id: steve.id, product_id: tshirt.id }),
            createFavorite({ user_id: moe.id, product_id: jeans.id }),
            createFavorite({ user_id: lucy.id, product_id: dress.id }),
            createFavorite({ user_id: steve.id, product_id: perfume.id }),
        ]);
        console.log("My Favorites :", await fetchFavorites());
    } catch (error) {
        console.error(error);
    }
};
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

init();
