import { CeramicClient } from "@ceramicnetwork/http-client"
import { ComposeClient } from "@composedb/client";
import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

import { QUERY_GET_NOUNISH_PROFILES } from "./queries.mjs"
import { QUERY_GET_PROPOSALS } from "./queries.mjs"

const definition = {
  "models": {
    "NounsProposal": {
      "id": "kjzl6hvfrbw6c8sde0sbybhp8z3s500ru1c4ifawovkqxet5h77gjyybu1567uj",
      "accountRelation": { "type": "list" }
    },
    "NounishProfile": {
      "id": "kjzl6hvfrbw6ca02lpn94dtzq5tn7vge0t9ayomihoba1ax0erj2xgun2j8qmo6",
      "accountRelation": { "type": "single" }
    }
  },
  "objects": {
    "NounsProposal": {
      "ens": { "type": "string", "required": false },
      "state": { "type": "string", "required": true },
      "proposer": { "type": "string", "required": true },
      "end_block": { "type": "integer", "required": true },
      "votes_for": { "type": "integer", "required": true },
      "blocknumber": { "type": "integer", "required": true },
      "description": { "type": "string", "required": true },
      "proposal_id": { "type": "integer", "required": true },
      "start_block": { "type": "integer", "required": true },
      "total_votes": { "type": "integer", "required": true },
      "total_supply": { "type": "integer", "required": true },
      "requested_eth": { "type": "integer", "required": false },
      "votes_abstain": { "type": "integer", "required": true },
      "votes_against": { "type": "integer", "required": true },
      "unique_holders": { "type": "integer", "required": true },
      "quorum_required": { "type": "integer", "required": true },
      "transactionhash": { "type": "string", "required": true },
      "created_timestamp": { "type": "integer", "required": true },
      "distinct_voters_for": { "type": "integer", "required": true },
      "total_distinct_voters": { "type": "integer", "required": true },
      "distinct_votes_abstain": { "type": "integer", "required": true },
      "distinct_voters_against": { "type": "integer", "required": true }
    },
    "NounishProfile": {
      "time_zone": { "type": "string", "required": false },
      "eth_address": { "type": "string", "required": true },
      "discord_username": { "type": "string", "required": false },
      "twitter_username": { "type": "string", "required": false },
      "discourse_username": { "type": "string", "required": false },
      "farcaster_username": { "type": "string", "required": false },
      "proposal_category_preference": { "type": "string", "required": false }
    }
  },
  "enums": {},
  "accountData": {
    "nounsProposalList": { "type": "connection", "name": "NounsProposal" },
    "nounishProfile": { "type": "node", "name": "NounishProfile" }
  }
}

const composeClient = new ComposeClient({
  ceramic: "https://nounsdata.wtf:7007",
  definition: definition
});

export const authenticate = async () => {
  const seed = "bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688"
  const key = fromString(
    seed,
    "base16"
  );
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key)
  })
  await did.authenticate()
  composeClient.setDID(did)
}

export const getNounishProfile = async () => {
  return await composeClient.executeQuery(QUERY_GET_NOUNISH_PROFILES);
}

export const getCeramicProposals = async () => {
  return await composeClient.executeQuery(QUERY_GET_PROPOSALS)
}

export const writeNounishProfile = async (profile) => {
  // TODO: Use relay.dev

  const testWrite = await composeClient.executeQuery(`        
         mutation {
            createNounishProfile(input: {
              content: {
                discord_username: "aaas 25522bore",
                proposal_category_preference: "treasuries"
                eth_address: "0xbabababababababababababababababababababa"
              }
            }) 
            {
              document {
                discord_username
                proposal_category_preference
              }
            }
          }`)
  console.log('testWriteNounishProfile: ' + JSON.stringify(testWrite))
}

export const writeProposal = async (proposal) => {

}
