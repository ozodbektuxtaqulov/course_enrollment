import express from "express";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import logger from "./library/logger.js";


const app = express();


app.use(express.json()); 


app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});


connectDB();


app.use("/api/auth", authRoutes); 
app.use("/api/courses", courseRoutes); 
app.use("/api/user", userRoutes); 

app.use(errorMiddleware);

logger.info("Express ilovasi ishga tushdi");

export default app;
