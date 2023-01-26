import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"
// import { authenticate, getCeramicProposals, getNounishProfile, writeNounishProfile } from "../../library/src/index.mjs"
import { authenticate, getCeramicProposals, getNounishProfile, writeNounishProfile } from "nounsdata"

// let proposals = await getProposals()
// console.log(JSON.stringify(proposals))

// proposals.forEach((proposal) => {
//   // write
// })

// console.log(JSON.stringify(getNounishProfile()))


const start = async () => {

  await authenticate()

  /*const profile = await getNounishProfile();
  console.log(JSON.stringify(profile))

  console.log('\n\n\n\\n\n\n\n\\n')

  const proposals = await getCeramicProposals();
  console.log(JSON.stringify(proposals))
*/

  console.log("getNounishProfile()" + JSON.stringify(await getNounishProfile()))
  console.log("getCeramicProposals()" + JSON.stringify(await getCeramicProposals()))

  const newProfile = {
    "discord_username": "ca yore",
    "proposal_category_preference": "philanthropy",
    "eth_address": "0xbabababababababababababababababababababa"
  }

  const result = getNounishProfile()
  console.log(JSON.stringify(result))
}

start() 
