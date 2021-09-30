import styled from 'styled-components';

const Row = styled.div`
display: flex;
`;

const Column = styled.div<{ width: string }>`
width: ${props => props.width};
padding: 20px;
`

export { Row, Column };