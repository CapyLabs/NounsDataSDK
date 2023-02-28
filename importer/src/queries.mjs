
import fetch from "node-fetch";


export const postGraphQl = async (url, query) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({query: query})
      })
    const json =  await response.json()
    return json
}


// Prophouse
export const URL_PROPHOUSE = 'https://prod.backend.prop.house/graphql'
export const QUERY_PROPHOUSE_PROPOSALS = `
{
  communities {
    id
    description
    profileImageUrl
    auctions {
      id
      startTime
      proposalEndTime
      votingEndTime
      title
      description
      proposals {
        id
        title
        address
        voteCount
        what
        tldr
      }
    }
  }
}`


// On chain

export const URL_THEGRAPH_LILNOUNS = "https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph"


export const QUERY_THEGRAPH_LILNOUNS_PROPOSALS = `{
  proposals(orderBy: createdTimestamp, orderDirection: desc) {
    id
    createdBlock
    createdTimestamp
    description
    status
    abstainVotes
    againstVotes
    forVotes
    endBlock
    startBlock
    calldatas
    createdTransactionHash
    signatures
    targets
    values
    quorumVotes
    proposer {
      id
      delegatedVotes
    }
    votes {
      id
      votes
      votesRaw
      blockNumber
      reason
      support
      supportDetailed
      voter {
        id
        delegatedVotes
      }
    }
  }
}`


export const QUERY_THEGRAPH_NOUNS_PROPOSALS = `{
  proposals {
    createdTimestamp
    calldatas
    status
    targets
    values
    totalSupply
    startBlock
    signatures
    quorumVotes
    proposalThreshold
    abstainVotes
    againstVotes
    quorumCoefficient
    createdBlock
    createdTransactionHash
    description
    endBlock
    executionETA
    forVotes
    id
    maxQuorumVotesBPS
    minQuorumVotesBPS
    votes {
      id
      votes
      votesRaw
      blockNumber
      reason
      support
      supportDetailed
      voter {
        id
        delegatedVotes
      }
    }
    proposer {
      delegatedVotes
      delegatedVotesRaw
      id
      tokenHoldersRepresentedAmount
    }
  }
}`

export const TRANSFORMS_THEGRAPH_PROPOSAL = {
  'calldatas': (calldatas) => calldatas.concat(',')

}

export const THEGRAPH_CERAMIC_KEY_MAP = {
  "createdBlock": "blocknumber",
  "createdTimestamp": "created_timestamp",
  "id": "proposal_id",
  "status": "state",
  "forVotes": "votes_for",
  "againstVotes": "votes_against",
  "abstainVotes": "votes_abstain",
  "description": "description",
  "startBlock": "start_block",
  "endBlock": "end_block",
}

export const TODO_REQUIRED_KEYS = {
  "quorumCoefficient": 0,
  "proposalThreshold": 0,
  "createdTransaction": 0,
  "totalSupply": 0,
  "executionETA": 0
}

export const INT_TYPES = [
  "createdBlock",
  "startBlock",
  "endBlock",
  "forVotes",
  "againstVotes",
  "abstainVotes",
  "id",
  "quorumVotes",
  "createdTimestamp"
]

export const ARRAY_TYPES = [
  "calldatas",
  "signatures",
  "targets",
  "values"
]

export const IGNORE_FIELDS = [
  'votes',
  'proposer'
]

