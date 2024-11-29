import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;  

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;  
  console.log(JWT_SECRET)
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido o expirado' });
    }

    req.user = user;  
    next();  
  });
};
