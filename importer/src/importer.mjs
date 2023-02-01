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
    forVotes
    createdBlock
  }
}`

/*const QUERY_PROPOSALS = `{
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
  }
}`*/

const getTheGraphProposals = async () => {
    const response = await fetch(URL_THEGRAPH_LILNOUNS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({query: QUERY_PROPOSALS})
      })
    const json =  await response.json()
    return json //return json['data']['proposal']  
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
  return ceramic_proposal
}

const ceramicProposalsEqual = (a, b) => {
  for (const [key, value] of Object.entries(THEGRAPH_CERAMIC_KEY_MAP)) {
    if (a[value] + "" != b[value] + "") {
      return false
    }
  }
  return true
}

const buildProposalIdToCeramicIdMap = (ceramicProposals) => {
  let map_proposal_id_to_ceramic_id = {}
  for (const proposal of ceramicProposals) {
    map_proposal_id_to_ceramic_id[proposal['proposal_id']] = proposal['id']
  }
  return map_proposal_id_to_ceramic_id;
}

const start = async () => {
  const client = new NounsDataClient()
  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  const thegraphResponse = await getTheGraphProposals()
  const thegraphProposals = thegraphResponse['data']['proposals']

  const ceramicResponse = await client.getCeramicProposals()
  const ceramicProposals = getCeramicProposals(ceramicResponse)

  const map_proposal_id_to_ceramic_id = buildProposalIdToCeramicIdMap(ceramicProposals)
  const already_uploaded_proposal_ids = Object.keys(map_proposal_id_to_ceramic_id)

  const dry_run = false

  for (const thegraphProposal of thegraphProposals) {
    if (!already_uploaded_proposal_ids.includes(thegraphProposal['id'])) {
      // TODO: Create new ceramic stream
      console.log('Create new ceramic Proposal id ' + thegraphProposal['id'])
    
      const thegraph_proposal_ceramic_format = theGraphProposalToCeramicProposal(thegraphProposal)
      console.log('writeProposal(' + JSON.stringify(thegraph_proposal_ceramic_format))
      if (!dry_run) {
        const response = await client.writeProposal(thegraph_proposal_ceramic_format)
        console.log('ceramic writeProposal response ' + JSON.stringify(response))
      }
    } else {
      // TODO: Upsert ceramic stream
      const ceramic_id = map_proposal_id_to_ceramic_id[thegraphProposal['id']]
      
      const upsertData = theGraphProposalToCeramicProposal(thegraphProposal)
      console.log('Update ceramic id ' + ceramic_id + ' with thegraph id ' + thegraphProposal['id'] )
    }
  }
}

start() 
