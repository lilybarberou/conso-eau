import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Consumption } from '@lib/types';
import { Table } from '@components/StyledComponents';
import Years from '@components/Years';
import { days, months, yearsList } from '@contexts/data';

export default function DailyConsumption() {
    const [selectedYear, setSelectedYear] = useState(2018);
    const [consumptions, setConsumptions] = useState<{ [date: string]: number }>({});

    useEffect(() => {
        const initPage = async () => {
            const query = await fetchApi('consumptions?avgDays=1', { method: 'GET' });
            if (query.success) {
                let obj: { [date: string]: number } = {};
                query.data.forEach((consumption: Consumption) => {
                    obj[`${consumption.year}-${consumption.month}-${consumption.day_number}`] = consumption.avg_consumption!;
                });

                setConsumptions(obj);
            }
        };

        initPage();
    }, []);

    const changeYear = (year: number) => {
        setSelectedYear(year);
    };

    return (
        <S.Container>
            <Head>
                <title>Consommations journalières</title>
            </Head>
            <h1>Consommation moyenne journalière</h1>
            <Years yearsList={yearsList} onClick={changeYear} selectedYear={selectedYear} />
            <Table $columnsNumber={8} $hideFirst={true}>
                <thead>
                    <tr>
                        <th></th>
                        {days.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {months.map((month, monthIndex) => (
                        <S.Row key={month}>
                            <td>{month}</td>
                            {days.map((day, dayIndex) => (
                                <td key={`${selectedYear}-${monthIndex}-${dayIndex}`}>
                                    {consumptions[`${selectedYear}-${monthIndex + 1}-${dayIndex + 1}`]?.toFixed(2) || 0}
                                </td>
                            ))}
                        </S.Row>
                    ))}
                </tbody>
            </Table>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
`;

S.Row = styled.tr`
    td:first-child {
        color: ${({ theme }) => theme.primary};
        font-size: 15px;
    }
`;
