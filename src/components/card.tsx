import * as React from 'react';
import styled from 'styled-components';

type CardProps = {
    background: string;
}

const Card = styled.div<CardProps>`
border-radius: 3px;
margin: 5px 0px;
background: ${props => props.background};
min-height: 80px;
padding: 10px;
display: flex;
justify-content: space-between;
flex-direction: column;
`;

export default Card;