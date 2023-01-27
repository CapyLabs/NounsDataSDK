"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUERY_WRITE_NOUNISH_PROFILE = exports.QUERY_GET_PROPOSALS = exports.QUERY_GET_NOUNISH_PROFILES = void 0;
exports.QUERY_GET_NOUNISH_PROFILES = `query { nounishProfileIndex(last:1000) {edges { node { 
  id 
  discord_username
  proposal_category_preference
  farcaster_username
}}}}`;
exports.QUERY_GET_PROPOSALS = `query { nounsProposalIndex(last:1000) {edges { node { 
    id 
      blocknumber
      proposal_id
      state
  } }} }`;
exports.QUERY_WRITE_NOUNISH_PROFILE = `TODO`;
/*
 const testWrite = await composeClient.executeQuery(`
        mutation {
           createNounishProfile(input: {
             content: {
               discord_username: "champion bore",
               proposal_category_preference: "treasuries"
               eth_address: "0xbabababababababababababababababababababa"
             }
           })
           {
             document {
               discord_username
               proposal_category_preference
             }
           }
         }`)

 */ 
