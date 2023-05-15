import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { fetchApi } from '@lib/api';
import { Consumption } from '@lib/types';
import { months, yearsList } from '@contexts/data';
import { daysInMonth } from '@contexts/Utils';
import Years from '@components/Years';
import LineChart from '@components/LineChart';

export default function MissingDays() {
    const firstRender = useRef(true);
    const [pourcents, setPourcents] = useState<
        {
            pourcentMissed: number;
            pourcentFailed: number;
        }[]
    >([]);
    const [selectedYear, setSelectedYear] = useState(2018);

    useEffect(() => {
        const initPage = async () => {
            if (firstRender.current) {
                return (firstRender.current = false);
            }

            const query = await fetchApi(`consumptions?year=${selectedYear}`, { method: 'GET' });

            // % de jours manquants + % de jours en rouges
            let obj: { [month: string]: boolean[] } = {};
            query.data.forEach((consumption: Consumption) => {
                const hoursStart = consumption.time_start.split(':')[0];
                const minutesStart = consumption.time_start.split(':')[1];
                const hoursEnd = consumption.time_end.split(':')[0];
                const minutesEnd = consumption.time_end.split(':')[1];

                const trueStart = Number(hoursStart) === 0 && Number(minutesStart) <= 30;
                const trueEnd = Number(hoursEnd) === 23 && Number(minutesEnd) >= 30;
                const isValid = trueStart && trueEnd;

                if (!(`${consumption.month}` in obj)) obj[consumption.month!] = [];
                obj[consumption.month!].push(isValid);
            });

            const initPourcents = Array.from(Array(12).keys()).map((month) => {
                if (!(`${month + 1}` in obj)) return { pourcentMissed: 100, pourcentFailed: 0 };

                const nbDays = daysInMonth(selectedYear, month + 1);

                const nbMissed = nbDays - obj[`${month + 1}`].length;
                const pourcentMissed = (nbMissed * 100) / nbDays;

                const nbFailed = obj[`${month + 1}`].filter((day) => day === false).length;
                const pourcentFailed = (nbFailed * 100) / nbDays;

                return { pourcentMissed, pourcentFailed };
            });

            setPourcents(initPourcents);
        };

        initPage();
    }, [selectedYear]);

    const changeYear = (year: number) => {
        setSelectedYear(year);
    };

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Jours manquants (%)',
                data: pourcents.map((pourcent) => pourcent.pourcentMissed.toFixed(2)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Jours où conso. incomplète (%)',
                data: pourcents.map((pourcent) => pourcent.pourcentFailed.toFixed(2)),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <S.Container>
            <Years yearsList={yearsList} onClick={changeYear} selectedYear={selectedYear} />
            <LineChart data={data} title='Pourcentages de jours manquants/conso incomplète' />
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div``;
