import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Select, Table } from '@components/StyledComponents';
import Years from '@components/Years';
import { months, yearsList } from '@contexts/data';

export default function WeeklyConsumptions() {
    const firstRender = useRef(true);
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState(2018);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [consumptions, setConsumptions] = useState<{ week: string; avg_consumption: number }[]>([]);

    useEffect(() => {
        const initPage = async () => {
            if (firstRender.current) {
                return (firstRender.current = false);
            }

            const query = await fetchApi(`consumptions?avgWeeks=1`, { method: 'GET' });
            query.success && setConsumptions(query.data);
        };

        initPage();
    }, []);

    const changeYear = (year: number) => {
        setSelectedYear(year);
    };
    const changeMonth = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(e.target.value));
    };

    return (
        <S.Container>
            <h2>Hebdomadaires</h2>
            <Years yearsList={yearsList} onClick={changeYear} selectedYear={selectedYear} />
            <Select defaultValue={currentMonth} onChange={changeMonth}>
                {months.map((month, index) => (
                    <option value={index + 1} key={index}>
                        {month}
                    </option>
                ))}
            </Select>
            <Table $columnsNumber={6} $columnsWidth='110px'>
                <thead>
                    <tr>
                        {consumptions
                            .filter((e) => e.week.includes(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`))
                            .map((consumption) => (
                                <th key={consumption.week}>{consumption.week.replaceAll('-', '/')}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {consumptions
                            .filter((e) => e.week.includes(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`))
                            .map((consumption) => (
                                <td key={consumption.week}>{consumption.avg_consumption.toFixed(2)}</td>
                            ))}
                    </tr>
                </tbody>
            </Table>
        </S.Container>
    );
}

const S: any = {};

S.Container = styled.div`
    margin-bottom: 30px;

    table {
        margin-top: 20px;
    }
`;
