import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
// import { NounsDataClient } from "nounsdata/dist/NounsDataClient.js"
// import { URL_THEGRAPH_NOUNS } from "./secrets.mjs"

import { URL_THEGRAPH_LILNOUNS, QUERY_THEGRAPH_LILNOUNS_PROPOSALS, THEGRAPH_CERAMIC_KEY_MAP, TODO_REQUIRED_KEYS, INT_TYPES, IGNORE_FIELDS } from "./queries.mjs"

import fetch from 'cross-fetch'

const getTheGraphProposals = async () => {
    const response = await fetch(URL_THEGRAPH_LILNOUNS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({query: QUERY_THEGRAPH_LILNOUNS_PROPOSALS})
      })
    const json =  await response.json()
    return json //return json['data']['proposal']  
}

const getCeramicProposals = (ceramicResponse) => {
  var proposals = []
  console.log('ceramicResponse: %s', JSON.stringify(ceramicResponse))
  const ceramicProposals = ceramicResponse['data']['nounsProposalIndex']['edges']
  ceramicProposals.forEach((proposal) => {
    var proposal = proposal['node']
    proposals.push(proposal)

  })
  return proposals;
}


// 'Internal Server Error': {"error":"Validation Error: data/description must NOT have more than 4096 characters"} 

// This function is essentially going to become
// https://github.com/CapyLabs/eventspy/blob/main/GetEvents.py#L40
const theGraphProposalToCeramicProposal = (thegraph_proposal) => {
  console.log('full thegraph_proposal: \n%s\n\n', thegraph_proposal)

  let ceramic_proposal = {}
  for (var [key, value] of Object.entries(thegraph_proposal)) {
    
    if (INT_TYPES.includes(key)) {
      value = parseInt(value)
    }

    if (IGNORE_FIELDS.includes(key)) {
      continue
    }

    if (key == 'id') {
      key = 'proposal_id'
    }

    ceramic_proposal[key] = value
  }
  
  /*if (!('quorumCoefficient' in thegraph_proposal)) {
    ceramic_proposal['quorumCoefficient'] = 0
  }*/
  for (var [key, value] of Object.entries(TODO_REQUIRED_KEYS)) {
    ceramic_proposal[key] = value
  }


  const proposer = thegraph_proposal['proposer']['id']
  ceramic_proposal['proposer'] = proposer
  ceramic_proposal['description'] = ceramic_proposal['description'].substring(0, 20000)
 
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

const ARGS_DRY_RUN = false

const start = async () => {
  const client = new NounsDataClient()
  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  const thegraphResponse = await getTheGraphProposals()
  const thegraphProposals = thegraphResponse['data']['proposals']

  const ceramicResponse = await client.getCeramicProposals()
  const ceramicProposals = getCeramicProposals(ceramicResponse)

  console.log('Loaded %d groundtruth items', thegraphProposals.length)
  console.log('Loaded %d ceramic items', ceramicProposals.length)

  const map_proposal_id_to_ceramic_id = buildProposalIdToCeramicIdMap(ceramicProposals)
  const already_uploaded_proposal_ids = Object.keys(map_proposal_id_to_ceramic_id)

  for (const thegraphProposal of thegraphProposals) {

    // TODO This is for testing    
    if (thegraphProposal['id'] != '93') {
      continue
    }

    if (!already_uploaded_proposal_ids.includes(thegraphProposal['id'])) {
      console.log('Create new ceramic Proposal id ' + thegraphProposal['id'])

      var thegraph_proposal_ceramic_format = theGraphProposalToCeramicProposal(thegraphProposal)
      delete thegraph_proposal_ceramic_format['undefined']

      console.log('writeProposal:\n\n' + JSON.stringify(thegraph_proposal_ceramic_format))
      

      try {
        var response = {}
        if (!ARGS_DRY_RUN) {
          response = await client.writeProposal(thegraph_proposal_ceramic_format)
        }
        console.log('ceramic writeProposal response ' + JSON.stringify(response))
      } catch (e) {
        console.log('ceramic writeProposal exception ' + e)
      }

    } else {
      const ceramic_id = map_proposal_id_to_ceramic_id[thegraphProposal['id']]
      
      const upsertData = theGraphProposalToCeramicProposal(thegraphProposal)
      console.log('Update ceramic id ' + ceramic_id + ' with thegraph id ' + thegraphProposal['id'] )
    
      try {
        var response = {}
        if (!ARGS_DRY_RUN) {
          response = await client.upsertProposal(ceramic_id, upsertData)
        }
        console.log('response: ' + JSON.stringify(response))
      } catch (e) {
        console.log('exception: ' + e)
      }
    }
  }
}

start() 
