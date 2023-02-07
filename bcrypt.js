import bcrypt from 'bcrypt';

export const cryptPassword = async (pass) => {
  return await bcrypt.hash(pass, 10);
}

export const verifyPassword = async (loginPass, DBPass) => {
  return await bcrypt.compare(loginPass, DBPass)
}