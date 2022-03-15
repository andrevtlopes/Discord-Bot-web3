import { gql } from 'graphql-request';

const query = gql`
    fragment PetFields on Pet {
        id
        createdAt
        forSale
        price
        name
        breedCount
        beastCount
        generation
        faction
        class
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
        tailD
        tailR
        tailR1
        earsD
        earsR
        earsR1
        parent1 {
            id
            __typename
        }
        parent2 {
            id
            __typename
        }
        avatarURL
        stage
        __typename
    }

    query pets(
        $stage: Int
        $page: Int
        $faction: [Int]
        $ownerId: Int
        $limit: Int
        $class: [Int]
        $beastCount: Int
        $breedCount: [Int]
        $generation: [Int]
        $forSale: Int
        $sortID: Boolean
        $sortPrice: Boolean
        $priceSetAt: Boolean
        $eyesD: [Int]
        $eyesR: [Int]
        $eyesR1: [Int]
        $mouthD: [Int]
        $mouthR: [Int]
        $mouthR1: [Int]
        $hairD: [Int]
        $hairR: [Int]
        $hairR1: [Int]
        $handD: [Int]
        $handR: [Int]
        $handR1: [Int]
        $tailD: [Int]
        $tailR: [Int]
        $tailR1: [Int]
        $earsD: [Int]
        $earsR: [Int]
        $earsR1: [Int]
        $lifeStage: Int
    ) {
        pets(
            filter: {
                stage: $stage
                faction: $faction
                class: $class
                beastCount: $beastCount
                breedCount: $breedCount
                generation: $generation
                forSale: $forSale
                ownerId: $ownerId
                eyesD: $eyesD
                eyesR: $eyesR
                eyesR1: $eyesR1
                mouthD: $mouthD
                mouthR: $mouthR
                mouthR1: $mouthR1
                hairD: $hairD
                hairR: $hairR
                hairR1: $hairR1
                handD: $handD
                handR: $handR
                handR1: $handR1
                tailD: $tailD
                tailR: $tailR
                tailR1: $tailR1
                earsD: $earsD
                earsR: $earsR
                earsR1: $earsR1
                lifeStage: $lifeStage
            }
            sort: { id: $sortID, price: $sortPrice, priceSetAt: $priceSetAt }
            page: $page
            limit: $limit
        ) {
            ...PetFields
            __typename
        }
    }
`;

export default query;
