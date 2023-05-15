import MissingDays from 'containers/MissingDays';
import TotalConsumptions from 'containers/TotalConsumptions';
import Head from 'next/head';
import styled from 'styled-components';

export default function ConsumptionsbyPeriod() {
    return (
        <S.Container>
            <Head>
                <title>Analytics</title>
            </Head>
            <h1>Analytics</h1>
            <TotalConsumptions />
            <MissingDays />
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    h1 {
        margin-bottom: 20px;
    }
`;
