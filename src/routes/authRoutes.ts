import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import User from '../models/User';

dotenv.config();
const router = Router();

router.post('/login', async (req, res) => {
  const privateKeyPath = process.env.PRIVATE_KEY_PATH;
  if (!privateKeyPath)
    return res.status(500).json({ status: 500, errors: { server: 'internalServerError' }});
  
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    const privateKey = fs.readFileSync(path.resolve(__dirname, privateKeyPath), 'utf8');
    
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user._id }, privateKey, { algorithm: 'RS256', expiresIn: '24h' });
      res.status(200).json({ username: user.username, email: user.email, token });
    } else {
      res.status(401).json({ status: 401, errors: { server: 'unauthorized'} });
    }
  } catch (error) {
    res.status(500).json({ status: 500, errors: { server: 'internalServerError' }});
  }
});

export default router;