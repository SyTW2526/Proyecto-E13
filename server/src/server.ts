import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { initSocket } from "./utils/socket";
import cors from "cors";
import router from "./routes/routes";
import { startCleanupJob } from "./jobs/cleanupTasks";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5200;

initSocket(httpServer);

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    startCleanupJob();
  });
}

export { app, httpServer };