// utils/tokenGenerator.js
import crypto from "crypto";

// Function to generate a random token
export const generateToken = () => {
  return crypto.randomBytes(16).toString("hex"); // 32-character token
};
