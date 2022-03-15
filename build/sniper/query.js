"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const query = (0, graphql_request_1.gql) `
    query pet($id: Int!) {
        pet(id: $id) {
            id
            name
            class
            owner {
                id
                name
                ethAddr
                __typename
            }
            breedCount
            generation
            faction
            eyesD
            eyesR
            eyesR1
            mouthD
            mouthR
            mouthR1
            hairD
            hairR
            hairR1
            handD
            handR
            handR1
            earsD
            earsR
            earsR1
            tailD
            tailR
            tailR1
            price
            createdAt
        }
        saleHistory(id: $id) {
            createdAt
            price
            buyer {
                id
                name
                ethAddr
                __typename
            }
            seller {
                id
                name
                ethAddr
                __typename
            }
            __typename
        }
    }
`;
exports.default = query;
