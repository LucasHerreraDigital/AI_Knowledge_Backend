import app from "./app.js";
import { env } from "./config/env.js";

const PORT = process.env.PORT || 3000;

app.listen(env.PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${env.PORT} (${env.NODE_ENV})`);
});