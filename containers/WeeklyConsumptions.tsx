import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Consumption } from '@lib/types';
import { Table } from '@components/StyledComponents';
import Years from '@components/Years';

export default function WeeklyConsumptions() {
    const [selectedYear, setSelectedYear] = useState(2018);
    const [consumptions, setConsumptions] = useState<{ [date: string]: number }>({});
    const months = ['Jan.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.'];
    const days = ['', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const yearsList = [2018, 2019];

    useEffect(() => {
        const initPage = async () => {
            const query = await fetchApi(`consumptions?avgWeeks=1`, { method: 'GET' });
            if (query.success) {
                let obj: { [date: string]: number } = {};
                query.data.forEach((consumption: Consumption) => {
                    obj[`${consumption.year}-${consumption.month}`] = consumption.avg_consumption!;
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
            <h2>Consommations hebdomadaires</h2>
            <Years yearsList={yearsList} onClick={changeYear} selectedYear={selectedYear} />
            <Table $hideFirst={true} $columnsNumber={13}>
                <thead>
                    <tr>
                        <th></th>
                        {months.map((month) => (
                            <th key={month}>{month}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {yearsList.map((year) => (
                        <S.Row key={year}>
                            <td>{year}</td>
                            {months.map((month, index) => (
                                <td key={`${year}-${index}`}>{consumptions[`${year}-${index + 1}`]?.toFixed(2) || 0}</td>
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
    margin-bottom: 30px;
`;

S.Row = styled.tr`
    td:first-child {
        color: ${({ theme }) => theme.primary};
        font-size: 15px;
    }
`;
