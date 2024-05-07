const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/UserRoutes");
const productRouter = require("./routes/ProductRoutes");
const categoryRouter = require("./routes/CategoryRoutes");
const orderRouter = require("./routes/OrderRoutes");
const cartRouter = require("./routes/CartRoutes");
const reviewRouter = require("./routes/ReviewRoutes");

const dbConnect = require("./config/dbConfig");
const { cloudinaryConnect } = require("./config/cloudinaryConfig");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server Running on port ${port}`));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/users/", userRouter);
app.use("/api/products/", productRouter);
app.use("/api/categories/", categoryRouter);
app.use("/api/orders/", orderRouter);
app.use("/api/cart/", cartRouter);
app.use("/api/reviews/", reviewRouter);

dbConnect();
cloudinaryConnect();
