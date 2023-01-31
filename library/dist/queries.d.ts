import { NounishProfile } from "../model/NounishProfile.js";
export declare const QUERY_GET_VIEWER_NOUNISH_PROFILE = "query {\n    viewer {\n      nounishProfile {\n        id\n        time_zone\n        eth_address\n        discord_username\n        twitter_username\n        discourse_username\n        farcaster_username\n        proposal_category_preference\n      }\n    }\n  }";
export declare type NounishProfileResponse = {
    data: {
        viewer: {
            nounishProfile: NounishProfile;
        };
    };
};
export declare type CreateNounishProfileResponse = {
    data: {
        createNounishProfile: {
            document: NounishProfile;
        };
    };
};
export declare const QUERY_GET_PROPOSALS = "query { nounsProposalIndex(last:1000) {edges { node { \n    id \n      blocknumber\n      proposal_id\n      state\n  } }} }";
export declare const QUERY_WRITE_NOUNISH_PROFILE = "TODO";
