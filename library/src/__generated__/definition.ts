export const definition = {
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