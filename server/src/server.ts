import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/route";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "Servidor funcionando correctamente 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log("\nServidor iniciado correctamente");
});