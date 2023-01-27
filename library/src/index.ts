import { NounsDataClient } from "./NounsDataClient.js"

export const start = async () => {
  const client = new NounsDataClient()
  await client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")

  console.log("getNounishProfile()" + JSON.stringify(await client.getNounishProfile()))
  console.log("getCeramicProposals()" + JSON.stringify(await client.getCeramicProposals()))
}