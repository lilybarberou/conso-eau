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
            whereFields.stmt = `WHERE date LIKE '%${req.query.month.toString().padStart(2, '0')}/${req.query.year}'`;
        }
        else if (req.query?.year) {
          customFields.push('time_start', 'time_end', "MONTH(STR_TO_DATE(date, '%d/%m/%Y')) AS month");
            whereFields.stmt = `WHERE date LIKE '%/${req.query.year}'`;
        }
        else if (req.query?.avgDays) {
            customFields.push("day_number, MONTH(STR_TO_DATE(date, '%d/%m/%Y')) AS month", "YEAR(STR_TO_DATE(date, '%d/%m/%Y')) AS year", 'AVG(final_consumption - consumption) AS avg_consumption', 'day_number');
            groupBy = "GROUP BY MONTH(STR_TO_DATE(date, '%d/%m/%Y')), YEAR(STR_TO_DATE(date, '%d/%m/%Y')), day_number";
        }
        else if (req.query?.avgWeeks) {
            customFields.push(" DATE_FORMAT(STR_TO_DATE(date, '%d/%m/%Y'), '%Y-%m-%d') - INTERVAL WEEKDAY(STR_TO_DATE(date, '%d/%m/%Y')) DAY AS week", 'AVG(final_consumption - consumption) as avg_consumption');
            groupBy = "GROUP BY week";
        }
        else if (req.query?.avgMonths) {
            customFields.push("MONTH(STR_TO_DATE(date, '%d/%m/%Y')) AS month", "YEAR(STR_TO_DATE(date, '%d/%m/%Y')) AS year", 'AVG(final_consumption - consumption) AS avg_consumption');
            groupBy = "GROUP BY MONTH(STR_TO_DATE(date, '%d/%m/%Y')), YEAR(STR_TO_DATE(date, '%d/%m/%Y'))";
        }
        else if (req.query?.sumMonths) {
          customFields.push("MONTH(STR_TO_DATE(date, '%d/%m/%Y')) AS month", "YEAR(STR_TO_DATE(date, '%d/%m/%Y')) AS year", 'SUM(final_consumption - consumption) AS sum_consumption');
          groupBy = "GROUP BY MONTH(STR_TO_DATE(date, '%d/%m/%Y')), YEAR(STR_TO_DATE(date, '%d/%m/%Y'))";
        }

        const sql = `SELECT ${customFields.length ?  customFields.join(', ') : consumptionsFields.join(', ')} FROM consumptions ${whereFields.stmt} ${groupBy}`;  
        const results = await sqlQuery(sql, whereFields.values);
        
        res.status(200).json({success: true, data: results});
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}