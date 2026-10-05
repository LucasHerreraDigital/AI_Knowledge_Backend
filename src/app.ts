import express from "express";
import cors from "cors"
import healthRoutes from "./modules/health/health.routes.js"
import { logger } from "./middlewares/logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js"
import cookieParser from "cookie-parser";


const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(logger)



app.use("/api",routes)
app.use("/health",healthRoutes)


app.use(errorMiddleware)
export default app;