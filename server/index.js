const { client, createTables } = require("./db");

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
    } catch (error) {
        console.error(error);
    }
};
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

init();
