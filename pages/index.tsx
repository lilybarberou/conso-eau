import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Consumption } from '@lib/types';
import { Select, Table } from '@components/StyledComponents';
import { daysInMonth } from '@contexts/Utils';
import Years from '@components/Years';

export default function Home() {
    const firstRender = useRef(true);
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState(2018);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [consumptions, setConsumptions] = useState<{ [date: string]: Consumption }>({});
    const columns = ['Date', 'Jour de la semaine', 'Date relève', 'Fin relève', 'Nombre de relève', 'Nb conso début', 'Nb conso fin', 'Ecart'];
    const days = ['', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const yearsList = [2018, 2019];

    useEffect(() => {
        const initPage = async () => {
            if (firstRender.current) return (firstRender.current = false);

            const query = await fetchApi(`consumptions?year=${selectedYear}&month=${selectedMonth}`, { method: 'GET' });

            if (query.success) {
                let obj: { [date: string]: Consumption } = {};
                query.data.forEach((consumption: Consumption) => {
                    obj[consumption.date] = consumption;
                });
                setConsumptions(obj);
            }
        };

        initPage();
    }, [selectedYear, selectedMonth]);

    const changeYear = (year: number) => {
        setSelectedYear(year);
    };
    const changeMonth = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(e.target.value));
    };

    return (
        <S.Container>
            <Head>
                <title>Accueil</title>
            </Head>
            <h1>Accueil</h1>
            <Years yearsList={yearsList} onClick={changeYear} selectedYear={selectedYear} />
            <Select defaultValue={currentMonth} onChange={changeMonth}>
                {months.map((month, index) => (
                    <option value={index + 1} key={index}>
                        {month}
                    </option>
                ))}
            </Select>
            <Table $columnsNumber={8}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from(Array(daysInMonth(selectedYear, selectedMonth)).keys()).map((day: number) => {
                        let consumption;

                        const date = `${(day + 1).toString().padStart(2, '0')}/${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`;
                        if (!consumptions[date]) {
                            const dateDay = new Date(selectedYear, selectedMonth - 1, day + 1).getDay() + 1;

                            return (
                                <S.Row key={`all-days-${day}`} $empty={true}>
                                    <td>{date}</td>
                                    <td>{days[dateDay]}</td>
                                </S.Row>
                            );
                        } else consumption = consumptions[date];

                        const hoursStart = consumption.time_start.split(':')[0];
                        const minutesStart = consumption.time_start.split(':')[1];
                        const hoursEnd = consumption.time_end.split(':')[0];
                        const minutesEnd = consumption.time_end.split(':')[1];

                        const trueStart = Number(hoursStart) === 0 && Number(minutesStart) <= 30;
                        const trueEnd = Number(hoursEnd) === 23 && Number(minutesEnd) >= 30;

                        return (
                            <S.Row key={`all-days-${consumption.id}`} $valid={trueStart && trueEnd}>
                                <td>{consumption.date}</td>
                                <td>{days[consumption.day_number]}</td>
                                <td>{consumption.time_start}</td>
                                <td>{consumption.time_end}</td>
                                <td>{consumption.shift_number}</td>
                                <td>{consumption.consumption}</td>
                                <td>{consumption.final_consumption}</td>
                                <td>{consumption.gap}</td>
                            </S.Row>
                        );
                    })}
                </tbody>
            </Table>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
`;

S.Row = styled.tr<{ $valid: boolean; $empty: boolean }>`
    ${({ $valid, $empty }) => ($empty ? 'background-color: #a5632c;' : $valid ? 'background-color: #138e13;' : 'background-color: #8b2929;')}
`;
