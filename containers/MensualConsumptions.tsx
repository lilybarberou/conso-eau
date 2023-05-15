import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Consumption } from '@lib/types';
import { Table } from '@components/StyledComponents';

export default function MensualConsumptions() {
    const [consumptions, setConsumptions] = useState<{ [date: string]: number }>({});
    const months = ['Jan.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.'];
    const yearsList = [2018, 2019];

    useEffect(() => {
        const initPage = async () => {
            const query = await fetchApi(`consumptions?avgMonths=1`, { method: 'GET' });
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

    return (
        <>
            <h2>Consommations mensuelles</h2>
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
        </>
    );
}

const S: any = {};

S.Row = styled.tr`
    td:first-child {
        color: ${({ theme }) => theme.primary};
        font-size: 15px;
    }
`;
