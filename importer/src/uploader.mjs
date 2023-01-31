import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
// import { NounsDataClient } from "nounsdata/dist/NounsDataClient.js"

import fetch from 'cross-fetch'

const URL_THEGRAPH_LILNOUNS = "https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph"

const QUERY_PROPOSALS = `{
  proposals(orderBy: createdTimestamp, orderDirection: desc) {
    id
    description
    status
    createdTimestamp
    abstainVotes
    againstVotes
    executionETA
    forVotes
    proposalThreshold
    targets
    values
  }
}`

const getTheGraphProposals = async () => {
    const response = await fetch(URL_THEGRAPH_LILNOUNS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({query: QUERY_PROPOSALS})
      })
    return await response.json()
      
}

const getCeramicProposals = (ceramicResponse) => {
  var proposals = []

  const ceramicProposals = ceramicResponse['data']['nounsProposalIndex']['edges']

  ceramicProposals.forEach((proposal) => {
    var proposal = proposal['node']
    proposals.push(proposal)

  })
  return proposals;
}

const THEGRAPH_CERAMIC_KEY_MAP = {
  "createdBlock": "blocknumber",
  "createdTimestamp": "created_timestamp",
  "id": "proposal_id",
  "status": "state",
  "forVotes": "votes_for",
  "againstVotes": "votes_against",
  "abstainVotes": "votes_abstain",
  "description": "description"
}

const theGraphProposalToCeramicProposal = (thegraph_proposal) => {
  let ceramic_proposal = {}

  for (const [key, value] of Object.entries(thegraph_proposal)) {
    ceramic_proposal[THEGRAPH_CERAMIC_KEY_MAP[key]] = value
  }
}

const start = async () => {
  const client = new NounsDataClient()

  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  /*
  console.log("getAuthenticatedNounishProfile:")
  try {
    console.log(JSON.stringify(await client.getAuthenticatedNounishProfile()))
  } catch (e) {
    console.log("ERROR: ", e)
  }*/



  // If closed, skip this one
  // If exists and is the same, return
  // Write proposal
  const proposals = await getTheGraphProposals();

  const ceramicResponse = await client.getCeramicProposals()
  const ceramicProposals = getCeramicProposals(ceramicResponse)

  ceramicProposals.forEach((proposal) => {
    
    if(proposal['state'] == 'ACTIVE') {
      console.log('active proposal ' + proposal.proposal_id)
      return;
    }
  })
}

start() 
