import type { NextApiRequest, NextApiResponse } from 'next'
import { sqlQuery } from '@lib/db';

const consumptionsFields = ['id', 'date', 'day_number', 'time_start', 'shift_number', 'time_end', 'consumption', 'final_consumption', '(final_consumption - consumption) AS gap'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; data?: any}>) {
  try {
    let whereFields = {stmt: '', values: [] as any[]};
    let groupBy = '';
    let customFields: string[] = [];

    // CREATE CONSUMPTIONS
    if (req.method === 'POST') {
      if (!req.body) res.status(401).json({success: false, message: 'Aucune donnée passée'});
        const body = JSON.parse(req.body);

        const sql = `INSERT INTO consumptions SET ?`;  
        const results = await sqlQuery(sql, [body]);
      
        res.status(200).json({success: true, data: results});
    }
    // GET CONSUMPTIONS
    else if (req.method === 'GET') {
        if (req.query?.year && req.query?.month) {
            whereFields.stmt = `WHERE date LIKE '%${req.query.month.padStart(2, '0')}/${req.query.year}'`;
        }
        if (req.query?.avgDays) {
            customFields.push('AVG(final_consumption - consumption) AS avg_consumption', 'day_number');
            groupBy = 'GROUP BY day_number';
        }

        const sql = `SELECT ${customFields.length ?  customFields.join(', ') : consumptionsFields.join(', ')} FROM consumptions ${whereFields.stmt} ${groupBy} LIMIT 50`;  
        const results = await sqlQuery(sql, whereFields.values);
        
        res.status(200).json({success: true, data: results});
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}