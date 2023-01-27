export const QUERY_GET_NOUNISH_PROFILES = `query { nounishProfileIndex(last:1000) {edges { node { 
  id 
  discord_username
  proposal_category_preference
  farcaster_username
}}}}`;
export const QUERY_GET_PROPOSALS = `query { nounsProposalIndex(last:1000) {edges { node { 
    id 
      blocknumber
      proposal_id
      state
  } }} }`;
export const QUERY_WRITE_NOUNISH_PROFILE = `TODO`;
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
