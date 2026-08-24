import "dotenv/config";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definida");
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
};