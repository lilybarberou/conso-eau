import styled from "styled-components";

export const Button = styled.button`
    background-color: ${({theme}) => theme.primary};
    border: none;
    color: white;
    padding: 10px 25px;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
    width: fit-content;
    font-weight: bold;
    transition: .2s;

    :hover {
        background-color: ${({theme}) => theme.primaryDark};
    }
`

export const Input  = styled.input<{$width?: string}>`
    height: 40px;
    padding: 0 10px;
    font-family: ${({ theme }) => theme.font};
    width: ${({ $width }) => $width ? $width : '100%'};
    box-sizing: border-box;

    :focus {
        outline: none;
    }
`

export const Select = styled.select`
    height: 35px;
    padding: 0 10px;
    font-family: ${({ theme }) => theme.font};

    :focus {
        outline: none;
    }
`