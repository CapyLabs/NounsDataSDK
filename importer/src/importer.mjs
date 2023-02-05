import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
// import { NounsDataClient } from "nounsdata/dist/NounsDataClient.js"

import { URL_THEGRAPH_NOUNS } from "./secrets.mjs"
import { QUERY_THEGRAPH_NOUNS_PROPOSALS, CACHED_QUERY_NOUNS_PROPOSALS_RESPONSE } from "./queries.mjs"


// TODO: 1. fix daoName and createdTimestamp (done)
// 1.5 When getting ceramic proposals need to pass daoName (done)
// 2. Implement big Nouns (done)
// 3. implement votes


import { URL_THEGRAPH_LILNOUNS, QUERY_THEGRAPH_LILNOUNS_PROPOSALS, THEGRAPH_CERAMIC_KEY_MAP, TODO_REQUIRED_KEYS, INT_TYPES, IGNORE_FIELDS } from "./queries.mjs"
import { postGraphQl } from "./queries.mjs"

import fetch from 'cross-fetch'





const ARGS_DRY_RUN = false
const MODELS = [
    /*{
      DAO_NAME: 'Lil Nouns',
      SOURCE_URL: URL_THEGRAPH_LILNOUNS,
      SOURCE_QUERY: QUERY_THEGRAPH_LILNOUNS_PROPOSALS
    },*/
    {
      DAO_NAME: 'Nouns',
      SOURCE_URL: URL_THEGRAPH_NOUNS,
      SOURCE_QUERY: QUERY_THEGRAPH_NOUNS_PROPOSALS
    }
]




const getTheGraphProposals = async() => {
  return postGraphQl(URL_THEGRAPH_LILNOUNS, QUERY_THEGRAPH_LILNOUNS_PROPOSALS)
}

// Sometimes we want to filter by field value e.g. where: daoName=Nouns
// but ceramic does not support this https://forum.ceramic.network/t/is-there-a-way-to-query-list-by-specific-field/776
// So do it manual;y
const getCeramicProposals = (ceramicResponse, daoName) => {
  var proposals = []
  console.log('ceramicResponse: %s', JSON.stringify(ceramicResponse))
  const ceramicProposals = ceramicResponse['data']['nounsProposalIndex']['edges']
  ceramicProposals.forEach((proposal) => {
    var proposal = proposal['node']
    if (daoName != "" && proposal['daoName'] == daoName) {
      proposals.push(proposal)
    }
  })
  return proposals;
}


// This function is essentially going to become
// https://github.com/CapyLabs/eventspy/blob/main/GetEvents.py#L40
const theGraphProposalToCeramicProposal = (thegraph_proposal) => {
  // console.log('full thegraph_proposal: \n%s\n\n', thegraph_proposal)

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

  // TODO: Fix model to not include these
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

const start = async (daoName, sourceUrl, sourceQuery) => {
  const client = new NounsDataClient()
  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  var thegraphResponse

  if (!ARGS_DRY_RUN) {
    try{
    var thegraphResponse = await postGraphQl(sourceUrl, sourceQuery) // await getTheGraphProposals()
    console.log('RESPONSE:\n\n' + JSON.stringify(thegraphResponse) + '\n\n\n')
    } catch (e) { console.log(JSON.stringify(e))}
  } else {
    thegraphResponse = CACHED_QUERY_NOUNS_PROPOSALS_RESPONSE
  }

  const thegraphProposals = thegraphResponse['data']['proposals']

  const ceramicResponse = await client.getCeramicProposals()
  const ceramicProposals = getCeramicProposals(ceramicResponse, daoName)

  console.log('Loaded %d groundtruth items', thegraphProposals.length)
  console.log('Loaded %d ceramic items', ceramicProposals.length)

  const map_proposal_id_to_ceramic_id = buildProposalIdToCeramicIdMap(ceramicProposals)
  const already_uploaded_proposal_ids = Object.keys(map_proposal_id_to_ceramic_id)

  for (const thegraphProposal of thegraphProposals) {

    var thegraph_proposal_ceramic_format = theGraphProposalToCeramicProposal(thegraphProposal)
    delete thegraph_proposal_ceramic_format['undefined']
    thegraph_proposal_ceramic_format['daoName'] = daoName


    // TODO This is for testing    
    /*if (thegraphProposal['id'] != '93') {
      continue
    }*/

    if (!already_uploaded_proposal_ids.includes(thegraphProposal['id'])) {
      console.log('Create new ceramic Proposal id ' + thegraphProposal['id'])
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
      
      const upsertData = thegraph_proposal_ceramic_format
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

for (const model of MODELS) {
  console.log('Start %s\n', model['DAO_NAME'])
  start(model['DAO_NAME'], model['SOURCE_URL'], model['SOURCE_QUERY'])
}

// start() 


