import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//import { notFound, errorHandler } from "./middlewares/ErrorHandler.js";

//ROUTES
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import CartRoutes from "./routes/CartRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";

//initial config
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({limit: '50mb'}));
//app.use(notFound);
//app.use(errorHandler);

// WELCOME ROUTE
app.get("/", (req, res) => {
  res
    .status(201)
    .json({ success: true, message: "Welcome to online shop API Basic" });
});

//AUTH ROUTES
app.use("/api/auth", AuthRoutes);

//USER ROUTES
app.use("/api/users", UserRoutes);

//PRODUCTS ROUTES
app.use("/api/products", ProductRoutes);

//CART ROUTES
app.use("/api/cart", CartRoutes);

//ORDER ROUTES
app.use("/api/orders", OrderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
