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




/*
type ProphouseProposal @createModel(accountRelation: LIST, description: "Prophouse proposals") {

  proposal_id: Int! @int(min: 0)
  contractAddress: String! @string(maxLength:2048)

  title: String! @string(maxLength:2048)
  what: String! @string(maxLength:20000)
  tldr: String! @string(maxLength:20000)

  voteCount: Int! @int(min: 0)
}
*/
export const QUERY_GET_PROPHOUSE_PROPOSALS = `
  query {
    prophouseProposalIndex(last: 1000) { edges { node {
      id
      proposal_id
      contractAddress
      title
      what
      tldr
      voteCount
    }}}
  }
`

// TODO: first, after could be passed as graphql variables
// instead of string replace
export const QUERY_GET_PROPHOUSE_PROPOSALS_PAGINATED_FIRST = `
  query {
    prophouseProposalIndex(first: INT_FIRST) { edges { node {
      id
      proposal_id
      contractAddress
      title
      what
      tldr
      voteCount
    }}
  pageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }
}}
`

export const QUERY_GET_PROPHOUSE_PROPOSALS_PAGINATED_FIRST_AFTER = `
  query {
    prophouseProposalIndex(first: INT_FIRST, after: \"STRING_AFTER\") { edges { node {
      id
      proposal_id
      contractAddress
      title
      what
      tldr
      voteCount
    }}
  pageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }
}}
`

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

export const QUERY_GET_PROPOSALS_PAGINATED_FIRST = `query { nounsProposalIndex(first: INT_FIRST) {edges { node { 
  id
  endBlock
  proposal_id
  proposer
  daoName
  status
}}

pageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}

}}`

export const QUERY_GET_PROPOSALS_PAGINATED_FIRST_AFTER = `query { nounsProposalIndex(first: INT_FIRST, after:\"STRING_AFTER\") {edges { node { 
  id
  endBlock
  proposal_id
  proposer
  daoName
  status
}}

pageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}

}}`



export const QUERY_GET_PROPOSALS = `query { nounsProposalIndex(last:1000) {edges { node { 
  id
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

  votes(first: 1000) {
    edges {
      node{
          eth_address
              blocknumber
              vote_id
              reason
              support
              supportDetailed
              votes
              votesRaw
              id
      }
    }
  }
  
}}}}`


export const QUERY_GET_PROPOSAL_VOTES = `
query { nounsProposalVoteIndex(last: 1000) {edges { node {
  id
  eth_address
  blocknumber
  vote_id
  reason
  support
  supportDetailed
  votes
  votesRaw
}}}}`

// TODO: first, after could be passed as graphql variables
// instead of string replace
/*export const QUERY_GET_PROPOSALS_PAGINATED_FIRST = `
  query {
    prophouseProposalIndex(first: INT_FIRST) { edges { node {
      id
      proposal_id
      contractAddress
      title
      what
      tldr
      voteCount
    }}
  pageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }
}}
`*/


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