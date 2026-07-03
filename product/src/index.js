import app from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(port, () => console.log(`Server is running on port ${port}`)),
);
