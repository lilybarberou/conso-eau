import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';
import { User } from '@lib/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 10;

type Response = {
    success: boolean;
    message?: string;
    access_token?: string;
    data?: User
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    if (req.method === 'POST') {
      if (!req.body) return res.status(401).json({success: false, message: 'Aucune donnée passée'});
      const body = JSON.parse(req.body);

      const checkEmailSql = "SELECT id FROM users WHERE email = ?";
      const checkEmail = await sqlQuery(checkEmailSql, [body.email]);
      if (checkEmail.length > 0) return res.status(401).json({success: false, message: 'Cet email existe déjà'});

      const hash = bcrypt.hashSync(body.password, saltRounds);
      body.password = hash;

      const sql = `INSERT INTO users SET ?`;  
      const result = await sqlQuery(sql, [body]);
      
      if (!result) {
        res.status(404).json({success: false, message: 'Erreur lors de la création du compte'});
        return;
      }
      
      const access_token = jwt.sign({ id: result.insertId, email: body.email }, process.env.JWT, { expiresIn: '30d' });
      delete body.password;

      res.status(200).json({success: true, access_token, data: body});
      return; 
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}