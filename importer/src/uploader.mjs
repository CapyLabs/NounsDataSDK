import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
// import { authenticate, getCeramicProposals, getNounishProfile, writeNounishProfile } from "nounsdata"

const start = async () => {
  const client = new NounsDataClient()

  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  console.log("getNounishProfile()" + JSON.stringify(await client.getNounishProfile()))

  console.log("getCeramicProposals()" + JSON.stringify(await client.getCeramicProposals()))

  // const newProfile = {
  //   "discord_username": "ca yore",
  //   "proposal_category_preference": "philanthropy",
  //   "eth_address": "0xbabababababababababababababababababababa"
  // }

  // const result = getNounishProfile()
  // console.log(JSON.stringify(result))
}

start() 
