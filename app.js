import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
// import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";


const app = express();


app.use(express.json()); 
app.use(morgan("dev")); 


connectDB();


app.use("/api/auth", authRoutes); 
app.use("/api/courses", courseRoutes); 
// app.use("/api/user", userRoutes); 


app.use(errorMiddleware);

export default app;
