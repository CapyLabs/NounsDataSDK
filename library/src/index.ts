import { NounsDataClient } from "./NounsDataClient.js"

export const start = async () => {
  const client = new NounsDataClient()
  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  //console.log("getNounishProfile()" + JSON.stringify(await client.getAuthenticatedNounishProfile()))
  //console.log("getCeramicProposals()" + JSON.stringify(await client.getCeramicProposals()))
  

  console.log("getCeramicProposals() length " + JSON.stringify(await client.getCeramicProposals()))
  // result['data']['nounsProposalIndex']['edges'].length

  const paginated = JSON.stringify(await client.getCeramicProposalsPaginated();
  console.log('-------------\n\n' + paginated)


  /*
  const proposal = {
    "proposal_id":"93",
    "description":"# lilnouns.eth: set reverse record\n\nThis is a simple proposal to set the reverse record from the treasury to be lilnouns.eth. By setting this reverse record, anyone will be able to easily send anything to Lil Nouns by simply inputting lilnouns.eth.\n\ncopypasta of https://nouns.wtf/vote/205 and https://nouns.wtf/vote/202."
    ,"state":"EXECUTED",
    "created_timestamp":"1673565179",
    "votes_abstain":"0",
    "votes_against":"0",
    "votes_for":"1478",
    "blocknumber":
    "16393921"
  }

  const proposal2 = {"proposal_id":"93","description":"# lilnouns.eth: set reverse record\n\nThis is a simple proposal to set the reverse record from the treasury to be lilnouns.eth. By setting this reverse record, anyone will be able to easily send anything to Lil Nouns by simply inputting lilnouns.eth.\n\ncopypasta of https://nouns.wtf/vote/205 and https://nouns.wtf/vote/202.","state":"EXECUTED","created_timestamp":"1673565179","votes_abstain":"0","votes_against":"0","votes_for":"1478","blocknumber":"16393921","end_block":"16426771","start_block":"16407061","distinct_voters_against":0,"distinct_votes_abstain":0,"total_distinct_voters":0,"distinct_voters_for":0,"transactionhash":"","quorum_required":0,"unique_holders":0,"total_supply":0,"total_votes":0,"proposer":"0x0"}

  const proposal3= {"proposal_id":93,"description":"# lilnouns.eth: set reverse record\n\nThis is a simple proposal to set the reverse record from the treasury to be lilnouns.eth. By setting this reverse record, anyone will be able to easily send anything to Lil Nouns by simply inputting lilnouns.eth.\n\ncopypasta of https://nouns.wtf/vote/205 and https://nouns.wtf/vote/202.","state":"EXECUTED","created_timestamp":1673565179,"votes_abstain":0,"votes_against":0,"votes_for":1478,"blocknumber":16393921,"end_block":16426771,"start_block":16407061,"distinct_voters_against":0,"distinct_votes_abstain":0,"total_distinct_voters":0,"distinct_voters_for":0,"transactionhash":"f","quorum_required":0,"unique_holders":0,"total_supply":0,"total_votes":0,"proposer":"0x0"}


  try {
    const response = await client.writeProposal(proposal3);
    console.log('writeProposal response: ' + JSON.stringify(response))
   } catch(e) {
     console.log('error: ' + e)
   }*/

}

start()