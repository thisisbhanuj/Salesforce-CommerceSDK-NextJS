import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export async function createToken(payload) {
  const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export async function verifyToken(token) {
  const payload = verify(token, process.env.JWT_SECRET);
  return payload;
}
