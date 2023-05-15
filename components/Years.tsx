import styled from 'styled-components';

export default function Years(props: { yearsList: number[]; onClick: (year: number) => void; selectedYear: number }) {
    return (
        <S.Years>
            {props.yearsList.length > 0 &&
                props.yearsList.map((year) => (
                    <span onClick={() => props.onClick(year)} className={props.selectedYear === year ? 'active' : ''} key={year}>
                        {year}
                    </span>
                ))}
        </S.Years>
    );
}

const S: any = {};

S.Years = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
    margin-bottom: 10px;

    span {
        cursor: pointer;
        color: ${({ theme }) => theme.primary};

        &.active {
            text-decoration: underline;
        }
    }
`;
