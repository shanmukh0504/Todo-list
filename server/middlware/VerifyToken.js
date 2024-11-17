import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyJwtToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token?.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {

        return res.status(401).json({ message: 'Wrong credentials' });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};
