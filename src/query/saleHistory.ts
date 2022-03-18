import { gql } from 'graphql-request';

const saleHistory = gql`
    query saleHistory($id: Int!) {
        saleHistory(id: $id) {
            createdAt
            price
        }
    }
`;

export default saleHistory;
