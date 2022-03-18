import { gql } from 'graphql-request';

const pet = gql`
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
            factionColor
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
            updatedAt
            forSale
            avatarURL
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

export default pet;
