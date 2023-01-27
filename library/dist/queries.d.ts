export declare const QUERY_GET_NOUNISH_PROFILES = "query { nounishProfileIndex(last:1000) {edges { node { \n  id \n  discord_username\n  proposal_category_preference\n  farcaster_username\n}}}}";
export declare const QUERY_GET_PROPOSALS = "query { nounsProposalIndex(last:1000) {edges { node { \n    id \n      blocknumber\n      proposal_id\n      state\n  } }} }";
export declare const QUERY_WRITE_NOUNISH_PROFILE = "TODO";
