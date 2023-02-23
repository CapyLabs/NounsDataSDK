// The composite runtime definition, copied from the generated file in the path composedb/models/generated/merged_runtime_composite.json

export const definition = {
   "models": {
      "NounishProfile": {
         "id": "kjzl6hvfrbw6c84ezcug10ld66fg22t01lnha1z07vw5mfcvrb08yobbq1r24ci",
         "accountRelation": { "type": "single" }
      },
      "NounsProposal": {
         "id": "kjzl6hvfrbw6c8ycbb32z6pg2xbk2a2g7yy098dxklop09utbdhhrbea3t805z2",
         "accountRelation": { "type": "list" }
      },
      "NounsProposalVote": {
         "id": "kjzl6hvfrbw6c6dmc8dbqgj4wvjqlfh1cha44nmwqqukde9mh5wswtsk6vi3gf2",
         "accountRelation": { "type": "list" }
      }
   },
   "objects": {
      "NounishProfile": {
         "time_zone": { "type": "string", "required": false },
         "eth_address": { "type": "string", "required": true },
         "discord_username": { "type": "string", "required": false },
         "twitter_username": { "type": "string", "required": false },
         "discourse_username": { "type": "string", "required": false },
         "farcaster_username": { "type": "string", "required": false },
         "proposal_category_preference": { "type": "string", "required": false },
         "did": { "type": "view", "viewType": "documentAccount" }
      },
      "NounsProposal": {
         "status": { "type": "string", "required": true },
         "values": {
            "type": "list",
            "required": true,
            "item": { "type": "string", "required": true }
         },
         "daoName": { "type": "string", "required": true },
         "targets": {
            "type": "list",
            "required": true,
            "item": { "type": "string", "required": true }
         },
         "endBlock": { "type": "integer", "required": true },
         "forVotes": { "type": "integer", "required": true },
         "proposer": { "type": "string", "required": true },
         "calldatas": {
            "type": "list",
            "required": true,
            "item": { "type": "string", "required": true }
         },
         "signatures": {
            "type": "list",
            "required": true,
            "item": { "type": "string", "required": true }
         },
         "startBlock": { "type": "integer", "required": true },
         "description": { "type": "string", "required": false },
         "proposal_id": { "type": "integer", "required": true },
         "quorumVotes": { "type": "integer", "required": true },
         "totalSupply": { "type": "integer", "required": true },
         "abstainVotes": { "type": "integer", "required": true },
         "againstVotes": { "type": "integer", "required": true },
         "createdBlock": { "type": "integer", "required": true },
         "executionETA": { "type": "integer", "required": false },
         "createdTimestamp": { "type": "integer", "required": true },
         "maxQuorumVotesBPS": { "type": "integer", "required": false },
         "minQuorumVotesBPS": { "type": "integer", "required": false },
         "proposalThreshold": { "type": "integer", "required": true },
         "quorumCoefficient": { "type": "integer", "required": true },
         "createdTransaction": { "type": "integer", "required": true },
         "createdTransactionHash": { "type": "string", "required": false },
         "votes": {
            "type": "view",
            "viewType": "relation",
            "relation": {
               "source": "queryConnection",
               "model": "kjzl6hvfrbw6c6dmc8dbqgj4wvjqlfh1cha44nmwqqukde9mh5wswtsk6vi3gf2",
               "property": "proposal_stream_id"
            }
         }
      },
      "NounsProposalVote": {
         "votes": { "type": "integer", "required": true },
         "reason": { "type": "string", "required": false },
         "support": { "type": "boolean", "required": true },
         "vote_id": { "type": "string", "required": true },
         "votesRaw": { "type": "integer", "required": true },
         "blocknumber": { "type": "integer", "required": true },
         "eth_address": { "type": "string", "required": true },
         "supportDetailed": { "type": "integer", "required": true },
         "proposal_stream_id": { "type": "streamid", "required": true },
         "nouns_proposal": {
            "type": "view",
            "viewType": "relation",
            "relation": {
               "source": "document",
               "model": "kjzl6hvfrbw6c8ycbb32z6pg2xbk2a2g7yy098dxklop09utbdhhrbea3t805z2",
               "property": "proposal_stream_id"
            }
         }
      }
   },
   "enums": {},
   "accountData": {
      "nounishProfile": { "type": "node", "name": "NounishProfile" },
      "nounsProposalList": { "type": "connection", "name": "NounsProposal" },
      "nounsProposalVoteList": {
         "type": "connection",
         "name": "NounsProposalVote"
      }
   }
}
