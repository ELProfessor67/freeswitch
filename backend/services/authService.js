import "dotenv/config"
import jwt from "jsonwebtoken"

export const generateJWTToken = (user) => {
  const jwttoken = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '15d' });
  return jwttoken;
}