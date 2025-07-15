import { customAlphabet, nanoid } from "nanoid";

export const generateSecret = (char) => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&/^";
  const nano = customAlphabet(alphabet, char); // generate 24‐char strings

  return `openpin-${nano()}`;
};
