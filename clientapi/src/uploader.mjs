

import { getProposals } from "./SourceProposals.mjs"
import { getPropHouse } from "./SourcePropHouse.mjs"
import { getSnapshot } from "./SourceSnapshot.mjs"


let proposals = await getProposals()
console.log(JSON.stringify(proposals))

proposals.forEach((proposal) => {
  // write
})