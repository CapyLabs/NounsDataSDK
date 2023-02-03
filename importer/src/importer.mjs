import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
// import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
import { NounsDataClient } from "nounsdata/dist/NounsDataClient.js"

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
    proposer {
      id
    }
    createdBlock
    endBlock
    startBlock
  }
}`

const THEGRAPH_CERAMIC_KEY_MAP = {
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

const TODO_REQUIRED_KEYS = {
  "distinct_voters_against": 0,
  "distinct_votes_abstain": 0,
  "total_distinct_voters": 0,
  "distinct_voters_for": 0,
  "transactionhash": "",
  "quorum_required": 0,
  "unique_holders": 0,
  "total_supply": 0,
  "total_votes": 0,
  "proposer": '0x0', // TODO: This one is important to implement, u can parse the nested field
}

const INT_TYPES = [
  "votes_for",
  "blocknumber",
  "proposal_id",
  "start_block",
  "end_block",
  "votes_abstain",
  "votes_against",
  "created_timestamp"
]

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

// Why does undefined appear here
// TODO: merge in TODO_REQUIRED_KEYS
// This function is essentially going to become
// https://github.com/CapyLabs/eventspy/blob/main/GetEvents.py#L40

const theGraphProposalToCeramicProposal = (thegraph_proposal) => {
  let ceramic_proposal = {}
  for (var [key, value] of Object.entries(thegraph_proposal)) {
    if (key == undefined) {
      continue
    }
    if (!(key in THEGRAPH_CERAMIC_KEY_MAP)) {
      continue
    }
    if (INT_TYPES.includes(THEGRAPH_CERAMIC_KEY_MAP[key])) {
      value = parseInt(value)
      console.log('int type ' + THEGRAPH_CERAMIC_KEY_MAP[key] )
    }
    ceramic_proposal[THEGRAPH_CERAMIC_KEY_MAP[key]] = value
  }
  for (const [key, value] of Object.entries(TODO_REQUIRED_KEYS)) {
    if (THEGRAPH_CERAMIC_KEY_MAP[key] in INT_TYPES) {
      value = parseInt(value)
    }
    ceramic_proposal[key] = value
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



    // TODO This is for testing    
    if (thegraphProposal['id'] != '93') {
      continue
    }


    if (!already_uploaded_proposal_ids.includes(thegraphProposal['id'])) {
      // TODO: Create new ceramic stream

      console.log('Create new ceramic Proposal id ' + thegraphProposal['id'])

      var thegraph_proposal_ceramic_format = theGraphProposalToCeramicProposal(thegraphProposal)
      delete thegraph_proposal_ceramic_format['undefined']

      console.log('writeProposal(' + JSON.stringify(thegraph_proposal_ceramic_format))
      
      try {
        const response = await client.writeProposal(thegraph_proposal_ceramic_format)

        console.log('ceramic writeProposal response ' + JSON.stringify(response))
      } catch (e) {
        console.log('ceramic writeProposal exception ' + e)
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
