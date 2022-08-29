import dotenv from "dotenv";
import express from "express";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import deliveryRequestRoutes from "./routes/deliveryRequestRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/supplierapi", (req, res) => {
  res.send("API is running...");
});

app.use("/supplierapi/users", userRoutes);
app.use("/supplierapi/deliveryRequests", deliveryRequestRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT_SUPPLIER || 8000;

app.listen(
  PORT,
  console.log(
    `Supplier Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
