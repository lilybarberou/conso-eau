import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Consumption } from '@lib/types';

export default function Home() {
    const [consumptions, setConsumptions] = useState<{ [day_number: number]: number }>([]);
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    useEffect(() => {
        const initPage = async () => {
            const query = await fetchApi('consumptions?avgDays=1', { method: 'GET' });
            if (query.success) {
                let obj: { [day_number: number]: number } = {};
                query.data.forEach((consumption: Consumption) => {
                    obj[consumption.day_number] = consumption.avg_consumption!;
                });
                setConsumptions(obj);
            }
        };

        initPage();
    }, []);

    return (
        <S.Container>
            <Head>
                <title>Consommations journalières</title>
            </Head>
            <h1>Consommations journalières</h1>
            <S.Table>
                <thead>
                    <S.Columns>
                        {days.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </S.Columns>
                </thead>
                <tbody>
                    <S.Row>
                        {Object.entries(consumptions).map(([day_number, avg_consumption]) => (
                            <td key={`day-${day_number}`}>{avg_consumption.toFixed(2)}</td>
                        ))}
                    </S.Row>
                </tbody>
            </S.Table>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
`;

S.Table = styled.table`
    width: fit-content;
    margin-top: 10px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    border-collapse: collapse;

    tr {
        display: grid;
        grid-template-columns: repeat(7, 120px);
    }
    td,
    th {
        border: 1px solid #575757;
        text-align: left;
        padding: 8px;
    }
`;

S.Columns = styled.tr`
    color: ${({ theme }) => theme.primary};
    font-size: 15px;
`;

S.Row = styled.tr<{ $valid: boolean }>`
    ${({ $valid }) => ($valid ? 'background-color: #138e13;' : 'background-color: #8b2929;')}
`;
