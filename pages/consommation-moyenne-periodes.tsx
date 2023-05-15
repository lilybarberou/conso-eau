import MensualConsumptions from 'containers/MensualConsumptions';
import WeeklyConsumptions from 'containers/WeeklyConsumptions';
import Head from 'next/head';
import styled from 'styled-components';

export default function ConsumptionsbyPeriod() {
    return (
        <S.Container>
            <Head>
                <title>Consommations par périodes</title>
            </Head>
            <h1>Consommations par périodes</h1>
            <WeeklyConsumptions />
            <MensualConsumptions />
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;

    h1 {
        margin-bottom: 20px;
    }
`;
