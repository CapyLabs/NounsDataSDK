import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
// import { NounsDataClient } from "nounsdata/dist/NounsDataClient.js"

import { URL_THEGRAPH_NOUNS } from "./secrets.mjs"
import { QUERY_THEGRAPH_NOUNS_PROPOSALS } from "./queries.mjs"

import { URL_THEGRAPH_LILNOUNS, QUERY_THEGRAPH_LILNOUNS_PROPOSALS, THEGRAPH_CERAMIC_KEY_MAP } from "./queries.mjs"
import { URL_PROPHOUSE, QUERY_PROPHOUSE_PROPOSALS } from "./queries.mjs"
import { postGraphQl } from "./queries.mjs"

import fetch from 'cross-fetch'
import { convertTheGraphProposalToCeramicProposal, convertTheGraphProposalToCeramicVotes } from "./converters.mjs"

const ARGS_DRY_RUN = true
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
  //   console.log('ceramicResponse: %s', JSON.stringify(ceramicResponse))
  const ceramicProposals = ceramicResponse['data']['nounsProposalIndex']['edges']
  ceramicProposals.forEach((proposal) => {
    var proposal = proposal['node']
    if (daoName != "" && proposal['daoName'] == daoName) {
      proposals.push(proposal)
    }
  })
  return proposals;
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

  if (true || !ARGS_DRY_RUN) {
    try{
      thegraphResponse = await postGraphQl(sourceUrl, sourceQuery) // await getTheGraphProposals()
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

    var thegraph_proposal_ceramic_format = convertTheGraphProposalToCeramicProposal(thegraphProposal)
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
          // TODO: Use the id returned from this and start creating the votes
          response = await client.writeProposal(thegraph_proposal_ceramic_format)
        }

        // const new_proposal_ceramic_id = response['data']['createNounsProposal']['document']['']
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

      const ceramic_proposal = ceramicProposals.find((proposal) => proposal['proposal_id'] == thegraphProposal['id'])
      console.log('Existing proposal votes: ' + JSON.stringify(ceramic_proposal['votes']))
      // TODO: convert existing proposal votes to a list of ceramic vote_ids. then,
      // only create the ones that are not in that list

      const ceramicFormatVotes = convertTheGraphProposalToCeramicVotes(thegraphProposal, ceramic_id)
      console.log('ceramic format votes: \n\n%s\n\n', JSON.stringify(ceramicFormatVotes))

      // Check if vote_id already exists, then dont create this

      for (const ceramicFormatVote of ceramicFormatVotes) {
        // TODO: Check this one isn't already written. may need upsert?

        if (!ARGS_DRY_RUN) {
          const response = await client.writeProposalVote(ceramicFormatVote)
          console.log('writeProposalVote response: ' + JSON.stringify(response))
        }
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
/*
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
  for client.writeCeramcProphouseProposal
}
*/
// \await importPropHouse()



