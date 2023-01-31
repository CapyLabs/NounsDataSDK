export declare const definition: {
    "models": {
        "NounsProposal": {
            "id": string;
            "accountRelation": {
                "type": string;
            };
        };
        "NounishProfile": {
            "id": string;
            "accountRelation": {
                "type": string;
            };
        };
    };
    "objects": {
        "NounsProposal": {
            "ens": {
                "type": string;
                "required": boolean;
            };
            "state": {
                "type": string;
                "required": boolean;
            };
            "proposer": {
                "type": string;
                "required": boolean;
            };
            "end_block": {
                "type": string;
                "required": boolean;
            };
            "votes_for": {
                "type": string;
                "required": boolean;
            };
            "blocknumber": {
                "type": string;
                "required": boolean;
            };
            "description": {
                "type": string;
                "required": boolean;
            };
            "proposal_id": {
                "type": string;
                "required": boolean;
            };
            "start_block": {
                "type": string;
                "required": boolean;
            };
            "total_votes": {
                "type": string;
                "required": boolean;
            };
            "total_supply": {
                "type": string;
                "required": boolean;
            };
            "requested_eth": {
                "type": string;
                "required": boolean;
            };
            "votes_abstain": {
                "type": string;
                "required": boolean;
            };
            "votes_against": {
                "type": string;
                "required": boolean;
            };
            "unique_holders": {
                "type": string;
                "required": boolean;
            };
            "quorum_required": {
                "type": string;
                "required": boolean;
            };
            "transactionhash": {
                "type": string;
                "required": boolean;
            };
            "created_timestamp": {
                "type": string;
                "required": boolean;
            };
            "distinct_voters_for": {
                "type": string;
                "required": boolean;
            };
            "total_distinct_voters": {
                "type": string;
                "required": boolean;
            };
            "distinct_votes_abstain": {
                "type": string;
                "required": boolean;
            };
            "distinct_voters_against": {
                "type": string;
                "required": boolean;
            };
        };
        "NounishProfile": {
            "time_zone": {
                "type": string;
                "required": boolean;
            };
            "eth_address": {
                "type": string;
                "required": boolean;
            };
            "discord_username": {
                "type": string;
                "required": boolean;
            };
            "twitter_username": {
                "type": string;
                "required": boolean;
            };
            "discourse_username": {
                "type": string;
                "required": boolean;
            };
            "farcaster_username": {
                "type": string;
                "required": boolean;
            };
            "proposal_category_preference": {
                "type": string;
                "required": boolean;
            };
        };
    };
    "enums": {};
    "accountData": {
        "nounsProposalList": {
            "type": string;
            "name": string;
        };
        "nounishProfile": {
            "type": string;
            "name": string;
        };
    };
};
