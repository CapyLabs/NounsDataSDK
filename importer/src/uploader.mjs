import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
// import { NounsDataClient } from "../../library/dist/NounsDataClient.js"
import { NounsDataClient } from "nounsdata/dist/NounsDataClient.js"

const start = async () => {
  const client = new NounsDataClient()

  console.log("getNounishProfile:")
  console.log(JSON.stringify(await client.getNounishProfile()))

  console.log("\ngetCeramicProposals:")
  console.log(JSON.stringify(await client.getCeramicProposals()))

  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  const profile = {
    "eth_address": "0xbabababababababababababababababababababa",
    "discord_username": "yo yore",
    "proposal_category_preference": "philanthropy",
  }

  console.log("\nwriteNounishProfile:")
  console.log(JSON.stringify(await client.writeNounishProfile(profile)))
}

start() 
