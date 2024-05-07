const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConfig");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server Running on port ${port}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}));

dbConnect();
