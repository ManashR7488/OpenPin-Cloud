import dotenv from "dotenv";

dotenv.config();

export const myError = (err, path) => {
  process.env.NODE_ENV === "development" &&
    console.error(`Error occurred in : ${path}`, err);
};
