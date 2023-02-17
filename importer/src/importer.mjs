import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
// import { NounsDataClient } from "nounsdata/dist/NounsDataClient.js"

import { URL_THEGRAPH_NOUNS } from "./secrets.mjs"
import { QUERY_THEGRAPH_NOUNS_PROPOSALS, CACHED_QUERY_NOUNS_PROPOSALS_RESPONSE } from "./queries.mjs"

import { URL_THEGRAPH_LILNOUNS, QUERY_THEGRAPH_LILNOUNS_PROPOSALS, THEGRAPH_CERAMIC_KEY_MAP, TODO_REQUIRED_KEYS, INT_TYPES, IGNORE_FIELDS } from "./queries.mjs"
import { URL_PROPHOUSE, QUERY_PROPHOUSE_PROPOSALS } from "./queries.mjs"
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

const theGraphProposalToCeramicVotes = (thegraph_proposal, proposal_ceramic_model_id, proposal_ceramic_id) => {
  let votes = []

  console.log('thegraph_proposal: \n\n%s\n\n\n' + JSON.stringify(thegraph_proposal))

  const real_votes = thegraph_proposal['votes']
  for (const real_vote of real_votes) {
    const vote_theGraph_format = {
      'proposal_stream_id': proposal_ceramic_model_id, // TODO: Is this how writing model with mutation works?
      'nouns_proposal': proposal_ceramic_id,
      'eth_address': real_vote['voter']['id'],
      'blocknumber': real_vote['blockNumber'],
      'vote_id': real_vote['id'],
      'reason': real_vote['reason'],
      'support': real_vote['support'],
      'supportDetailed': real_vote['supportDetailed'],
      'votes': parseInt(real_vote['votes']),
      'votesRaw': parseInt(real_vote['votesRaw'])
    }
    votes.push(vote_theGraph_format)
  }
  return votes
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


  // TODO: This should depend on if we're doing lil nouns or big nouns...
  const proposal_stream_id = "kjzl6hvfrbw6c8ycbb32z6pg2xbk2a2g7yy098dxklop09utbdhhrbea3t805z2";
      


  for (const thegraphProposal of thegraphProposals) {

    var thegraph_proposal_ceramic_format = theGraphProposalToCeramicProposal(thegraphProposal)
    delete thegraph_proposal_ceramic_format['undefined']
    thegraph_proposal_ceramic_format['daoName'] = daoName


    // TODO This is for testing    
    /*if (thegraphProposal['id'] != '93') {
      continue
    }*/

    var nouns_proposapl_id = -1;

    if (!already_uploaded_proposal_ids.includes(thegraphProposal['id'])) {
      console.log('Create new ceramic Proposal id ' + thegraphProposal['id'])
      console.log('writeProposal:\n\n' + JSON.stringify(thegraph_proposal_ceramic_format))

      try {
        var response = {}
        if (!ARGS_DRY_RUN) {
          response = await client.writeProposal(thegraph_proposal_ceramic_format)
        }

        // The writeProposal response does not include the created proposal
        // ceramic id which is necessary to write the ProposalVotes.
        // So either way we need a seperate call to figure out
        // the proposal ceramic ids before the votes can be added.
        console.log('ceramic writeProposal response ' + JSON.stringify(response))
      

        //const new_proposal_ceramic_id = response['data']['createNounsProposal']['document']['']
      } catch (e) {
        console.log('ceramic writeProposal exception ' + e)
      }

      // TODO: Make sure we get created proposal ceramic id 
      // from response so we can have it for theGraphProposalToCeramicVotes 
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

      const ceramicFormatVotes = theGraphProposalToCeramicVotes(thegraphProposal, proposal_stream_id, ceramic_id)
      console.log('ceramic format votes: \n\n%s\n\n', JSON.stringify(ceramicFormatVotes))

      for (const ceramicFormatVote of ceramicFormatVotes) {
        // TODO: Check this one isn't already written. may need upsert?
        const response = await client.writeProposalVote(ceramicFormatVote)
        console.log('writeProposalVote response: ' + JSON.stringify(response))
      }


      // Write proposal votes approaches.

      // TODO: This needs to be tested and to not write votes twice
      // We need to get the votes already written to ceramic

      // Big nouns will likely have more than 1000 votes and ceramic only
      // lets you query 1000 at a time, so we need to paginate to make sure
      // we get all the written votes

      // Or Fix proposal model so we can query associated proposal votes 
      // https://composedb.js.org/docs/preview/guides/creating-composites/directives#relationfrom

      /*
      for (const ceramicFormatVote of ceramicFormatVotes) {
        await client.writeProposalVote(ceramicFormatVote)
      }*/

      return
    }
  }
}

// On chain proposals from TheGraph
for (const model of MODELS) {
  console.log('Start %s\n', model['DAO_NAME'])
  start(model['DAO_NAME'], model['SOURCE_URL'], model['SOURCE_QUERY'])
}


////////////////////////////////


//////////////////////////////////


// Prophouse
const importPropHouse = async () => {
  const client = new NounsDataClient()
  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")


  const data = await postGraphQl(URL_PROPHOUSE, QUERY_PROPHOUSE_PROPOSALS)

  var maxProposalId = 0
  var map_id_to_proposal = {}

  const communities = data['data']['communities']
  for (const community of communities) {
    for (const auction of community['auctions']) {
      for (const proposal of auction['proposals']) {
        console.log('%d %s %s %s', proposal['id'], proposal['address'], proposal['title'], proposal['voteCount'])
        if (proposal['id'] > maxProposalId) {
          maxProposalId = proposal['id']
        }

        map_id_to_proposal[proposal['id']] = proposal
      }
    }
  }

  console.log('maxProposalId: %d', maxProposalId)

  var ceramicPropHouseProposals = await client.getCeramicProphouseProposals()
  ceramicPropHouseProposals = ceramicPropHouseProposals['data']['prophouseProposalIndex']['edges']
  console.log('Loaded %d ceramic prophouse proposals', ceramicPropHouseProposals.length)

  // V1
  // Get all ceramic prophouse proposals
  // Do normal upsert or create


  /* Make object like 
   proposal_id: Int! @int(min: 0)
  contractAddress: String! @string(maxLength:2048)

  title: String! @string(maxLength:2048)
  what: String! @string(maxLength:20000)
  tldr: String! @string(maxLength:20000)

  voteCount: Int! @int(min: 0)
  for client.writeCeramcProphouseProposal*/
}

// \await importPropHouse()



