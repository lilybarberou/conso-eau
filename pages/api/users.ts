import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';
import { User } from '@lib/types';

const userFields = ['id', 'role', 'email', 'firstname', 'name', 'address', 'city', 'postal_code'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: User[]}>) {
  try {
    let whereFields = {stmt: '', values: [] as any[]};

    // GET USER
    if (req.method === 'GET') {
      if (req.query?.id) {
        whereFields.stmt += ' AND id = ?';
        whereFields.values.push(req.query.id);
      }

      const sql = `SELECT ${userFields.join(', ')} FROM members ${whereFields.stmt}`;  
      const results: User[] = await sqlQuery(sql, whereFields.values);
      
      res.status(200).json({success: true, data: results});
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}