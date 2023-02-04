import { NounishProfile } from "../model/NounishProfile.js"

export const QUERY_GET_VIEWER_NOUNISH_PROFILE = 
  `query {
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
  }`

export type NounishProfileResponse = {
  data: {
    viewer: {
      nounishProfile: NounishProfile
    }
  }
}

export type CreateNounishProfileResponse = {
  data: {
    createNounishProfile: {
      document: NounishProfile
    }
  }
}

export const QUERY_GET_PROPOSALS = `query { nounsProposalIndex(last:1000) {edges { node { 
  abstainVotes
  againstVotes
  calldatas
  createdBlock
  createdTimestamp
  createdTransaction
  description
  endBlock
  executionETA
  forVotes
  proposal_id
  maxQuorumVotesBPS
  minQuorumVotesBPS
  proposalThreshold
  proposer
  quorumCoefficient
  quorumVotes
  signatures
  startBlock
  status
  targets
  totalSupply
  values
  daoName
  createdTransactionHash
}}}}`


export const QUERY_WRITE_NOUNISH_PROFILE =
  `TODO`

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