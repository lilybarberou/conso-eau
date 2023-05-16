import type { NextApiRequest, NextApiResponse } from 'next'
import createInvoice from '@lib/createInvoice';
import { readFileSync } from 'fs';
import { Invoice, User } from '@lib/types';
import jwt from 'jsonwebtoken';
import { sqlQuery } from '@lib/db';
import { semestersNum, trimestersNum } from '@contexts/data';
import { daysInMonth } from '@contexts/Utils';

type Body = {
  token: string;
  period: number;
  year: number;
  day: number;
  month: number;
  week: string;
  trimester: number;
  semester: number;
}

type Token = {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{success: boolean; message?: string; buffer?: any}>) {
  try {
    if (req.method === 'POST') {
      let whereFields = {stmt: '', values: [] as any[]};
      let invoicePeriodLabel = '';

      const data = JSON.parse(req.body) as Body;
      console.log(data);

      // GET AMOUNT BY PERIOD
      // DAY
      if (data.period === 0) {
        const date = `${data.day.toString().padStart(2, '0')}/${data.month.toString().padStart(2, '0')}/${data.year}`;
        invoicePeriodLabel = date;

        whereFields.stmt = `WHERE date = '${date}'`;
      }
      // WEEK
      else if (data.period === 1) {
        invoicePeriodLabel = `Semaine ${data.week}`;
        const week = data.week.split('/');
        whereFields.stmt = `WHERE DATE_FORMAT(STR_TO_DATE(date, '%d/%m/%Y'), '%Y-%m-%d') - INTERVAL WEEKDAY(STR_TO_DATE(date, '%d/%m/%Y')) DAY = '${week[2]}-${week[1]}-${week[0]}'`;
      }
      // MONTH
      else if (data.period === 2) {
        const month = data.month.toString().padStart(2, '0');
        invoicePeriodLabel = `01/${month}/${data.year} - ${daysInMonth(data.year, data.month)}/${month}/${data.year}`;
        whereFields.stmt = `WHERE date LIKE '%${data.month.toString().padStart(2, '0')}/${data.year}'`;
      }
      // TRIMESTER / SEMESTER
      else if (data.period === 3 || data.period === 4) {
        const current = data.period === 3 ? trimestersNum[data.trimester] : semestersNum[data.semester];
        const start = current.start.toString().padStart(2, '0');
        const end = current.end.toString().padStart(2, '0');
        invoicePeriodLabel = `01/${start}/${data.year} - ${daysInMonth(data.year, current.end)}/${end}/${data.year}`;

        whereFields.stmt = `WHERE MONTH(STR_TO_DATE(date, '%d/%m/%Y')) >= ${start} AND MONTH(STR_TO_DATE(date, '%d/%m/%Y')) <= ${end} AND date LIKE '%/${data.year}'`;
      }
      // YEAR
      else if (data.period === 5) {
        invoicePeriodLabel = `01/01/${data.year} - 31/12/${data.year}`;
        whereFields.stmt = `WHERE date LIKE '%/${data.year}'`;
      }

      const sql = `SELECT SUM(final_consumption - consumption) AS amount FROM consumptions ${whereFields.stmt}`;  
      const results = await sqlQuery(sql, whereFields.values);
      
      
      // GET USERS INFOS
      const decodedToken = jwt.decode(data.token) as Token;
      
      const userSql = `SELECT name, firstname, address, city, postal_code FROM users WHERE id = ?`;
      const result = await sqlQuery(userSql, [decodedToken.id]);

      if (result.length === 0) {
        res.status(500).json({success: false, message: 'Utilisateur inexistant'});
        return;
      } 

      const user = result[0] as User;

      // PREPARE INVOICE
      const invoice: Invoice = {
        shipping: {
            name: user.firstname + ' ' + user.name,
            address: user.address,
            city: user.city,
            postal_code: user.postal_code,
        },
        items: [
            {
                title: invoicePeriodLabel,
                quantity: results[0].amount || 0,
                amount: (results[0].amount * 0.00345).toFixed(2) || 0,
            },
        ],
      };
        
      createInvoice(invoice, 'lib/invoice.pdf');

      // send pdf to client
      const file = readFileSync('lib/invoice.pdf');
      const buffer = Buffer.from(file).toString('base64');
      
      res.status(200).json({success: true, buffer});
    }
  }
  catch(err: any) {
    res.status(500).json({ success: false, message: err });
  }
}