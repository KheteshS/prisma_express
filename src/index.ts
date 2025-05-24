import dotenv from "dotenv";
import userRoutes from "./routes/user";
import todoRoutes from "./routes/todos";

dotenv.config();

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/auth", userRoutes);
app.use("/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
