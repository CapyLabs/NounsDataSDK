import { NounsDataClient } from "./NounsDataClient.js"

export const start = async () => {
  const client = new NounsDataClient()
  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  //console.log("getNounishProfile()" + JSON.stringify(await client.getAuthenticatedNounishProfile()))
  // console.log("getCeramicProposals()" + JSON.stringify(await client.getCeramicProposals()))

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

  try {
    const response = await client.writeProposal(proposal);
    console.log('writeProposal response: ' + JSON.stringify(response))
   } catch(e) {
     console.log('error: ' + e)
   }

}

start()