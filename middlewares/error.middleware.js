import mongoose from "mongoose";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Noto'g'ri ID: ${err.value}` });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validatsiya xatosi", errors });
  }

  // Umumiy xato
  res.status(err.status || 500).json({
    message: err.message || "Server xatosi",
  });
};

export default errorMiddleware;
