import { Button, Select } from '@components/StyledComponents';
import { daysInMonth, downloadPDF, getFirstDayOfWeeks, getFormData } from '@contexts/Utils';
import { months, semesters, trimesters, yearsList } from '@contexts/data';
import { fetchApi } from '@lib/api';
import Head from 'next/head';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

type ChooseDayMonthYearProps = {
    showDays?: boolean;
    showWeeks?: boolean;
    showMonths?: boolean;
    showTrimesters?: boolean;
    showSemesters?: boolean;
};

export default function Facturation() {
    const token = localStorage.getItem('access_token');
    const [period, setPeriod] = useState('0');
    const periods = ['Jour', 'Semaine', 'Mois', 'Trimestrielle', 'Semestrielle', 'Année'];

    const handleDownload = async () => {
        const data = getFormData('#form');

        const query = await fetchApi(`pdf`, { method: 'POST', body: JSON.stringify({ period: Number(period), token, ...data }) });
        // if (query.success) downloadPDF(query.buffer);
        // else toast.error(query.message);
    };

    const changePeriod = (e: ChangeEvent<HTMLSelectElement>) => {
        setPeriod(e.target.value);
    };

    const GetFormRender = () => {
        switch (period) {
            case '0': // jour
                return <ChooseDayMonthYear showDays={true} showMonths={true} />;
            case '1': // semaine
                return <ChooseDayMonthYear showWeeks={true} showMonths={true} />;
            case '2': // mois
                return <ChooseDayMonthYear showMonths={true} />;
            case '3': // trimestre
                return <ChooseDayMonthYear showTrimesters={true} />;
            case '4': // semestre
                return <ChooseDayMonthYear showSemesters={true} />;
            case '5': // année
                return <ChooseDayMonthYear />;
            default:
                return <ChooseDayMonthYear />;
        }
    };

    const ChooseDayMonthYear = (props: ChooseDayMonthYearProps) => {
        const [selectedYear, setSelectedYear] = useState('2018');
        const [selectedMonth, setSelectedMonth] = useState('1');

        const getDaysArray = () => {
            const nb = daysInMonth(Number(selectedYear), Number(selectedMonth));
            return Array.from(Array(nb).keys());
        };

        return (
            <S.FormContainer id='form'>
                {props.showDays && (
                    <Select className='days' name='day'>
                        {getDaysArray().map((day) => (
                            <option value={day + 1} key={day}>
                                {day + 1}
                            </option>
                        ))}
                    </Select>
                )}
                {props.showWeeks && (
                    <Select className='week' name='week'>
                        {getFirstDayOfWeeks(Number(selectedYear), Number(selectedMonth) - 1).map((week) => (
                            <option value={week} key={week}>
                                {week}
                            </option>
                        ))}
                    </Select>
                )}
                {props.showMonths && (
                    <Select className='month' name='month' onChange={(e) => setSelectedMonth(e.target.value)}>
                        {months.map((month, index) => (
                            <option value={index + 1} key={index}>
                                {month}
                            </option>
                        ))}
                    </Select>
                )}
                {props.showTrimesters && (
                    <Select className='trimester' name='trimester'>
                        {trimesters.map((trimester, index) => (
                            <option value={index} key={index}>
                                {trimester}
                            </option>
                        ))}
                    </Select>
                )}
                {props.showSemesters && (
                    <Select className='semester' name='semester'>
                        {semesters.map((semesters, index) => (
                            <option value={index} key={index}>
                                {semesters}
                            </option>
                        ))}
                    </Select>
                )}
                <Select className='year' name='year' onChange={(e) => setSelectedYear(e.target.value)}>
                    {yearsList.map((year, index) => (
                        <option value={year} key={index}>
                            {year}
                        </option>
                    ))}
                </Select>
            </S.FormContainer>
        );
    };

    return (
        <S.Container>
            <Head>
                <title>Facturation</title>
            </Head>
            <h1>Facturation</h1>
            <S.SelectContainer>
                <span>Choix de la période :</span>
                <Select defaultValue={0} onChange={changePeriod}>
                    {periods.map((period, index) => (
                        <option value={index} key={index}>
                            {period}
                        </option>
                    ))}
                </Select>
            </S.SelectContainer>
            {<GetFormRender />}
            <Button onClick={handleDownload}>Télécharger</Button>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    height: 100vh;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    select {
        width: 200px;
    }
`;

S.SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

S.FormContainer = styled.form`
    display: flex;
    gap: 10px;

    .days {
        width: 60px;
    }
    .week {
        width: 120px;
    }
    .month {
        width: 120px;
    }
    .year {
        width: 80px;
    }
    .trimester {
        width: 200px;
    }
    .semester {
        width: 160px;
    }
`;
