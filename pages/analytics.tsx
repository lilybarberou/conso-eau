import Head from 'next/head';
import styled from 'styled-components';

export default function ConsumptionsbyPeriod() {
    return (
        <S.Container>
            <Head>
                <title>Analytics</title>
            </Head>
            <h1>Analytics</h1>
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
