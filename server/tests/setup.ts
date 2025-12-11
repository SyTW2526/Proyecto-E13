import { config } from "dotenv";
import { resolve } from "path";

// Cargar variables de entorno desde el .env en la raíz del proyecto
config({ path: resolve(__dirname, "../../.env") });
