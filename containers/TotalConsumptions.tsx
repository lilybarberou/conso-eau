import { months } from '@contexts/data';
import { useEffect, useState } from 'react';
import { fetchApi } from '@lib/api';
import { Consumption } from '@lib/types';
import LineChart from '@components/LineChart';

export default function TotalConsumptions() {
    const [consumptions, setConsumptions] = useState<{ [date: string]: number }>({});

    useEffect(() => {
        const initPage = async () => {
            const query = await fetchApi(`consumptions?sumMonths=1`, { method: 'GET' });

            if (query.success) {
                let obj: { [date: string]: number } = {};
                query.data.forEach((consumption: Consumption) => {
                    obj[`${consumption.year}-${consumption.month}`] = consumption.sum_consumption!;
                });

                setConsumptions(obj);
            }
        };

        initPage();
    }, []);

    const data = {
        labels: months,
        datasets: [
            {
                label: '2018',
                data: months.map((month, index) => consumptions[`2018-${index + 1}`] || 0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: '2019',
                data: months.map((month, index) => consumptions[`2019-${index + 1}`] || 0),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return <LineChart title='Consommations complètes annuelles' data={data} />;
}
