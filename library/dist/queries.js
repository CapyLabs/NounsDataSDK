export const QUERY_GET_VIEWER_NOUNISH_PROFILE = `query {
    viewer {
      nounishProfile {
        id
        time_zone
        eth_address
        discord_username
        twitter_username
        discourse_username
        farcaster_username
        proposal_category_preference
      }
    }
  }`;
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
