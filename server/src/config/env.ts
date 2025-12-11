import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde la raíz del proyecto ANTES de cualquier otra cosa
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
