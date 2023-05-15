import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
    title: string;
    data: any;
};

export default function LineChart(props: Props) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: props.title,
            },
        },
    };

    return (
        <S.LineContainer>
            <Line options={options} data={props.data} />
        </S.LineContainer>
    );
}

const S: any = {};
S.LineContainer = styled.div`
    width: 500px;
    background: #ffffff;
`;
