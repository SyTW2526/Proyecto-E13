import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.listen(PORT, () => {
  console.log("\nServer is running on port:", PORT);
});
