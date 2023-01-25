// This is an auto-generated file, do not edit manually
export const definition = {
  "models": {
    "NounishProfile": {
      "id": "kjzl6hvfrbw6cb7g13vhmfu4px7x76glq31bm5zbwikyf5qhy7zh4fssss3w1zb",
      "accountRelation": { "type": "single" }
    }
  },
  "objects": {
    "NounishProfile": {
      "time_zone": { "type": "string", "required": true },
      "eth_address": { "type": "string", "required": true },
      "discord_username": { "type": "string", "required": true },
      "twitter_username": { "type": "string", "required": true },
      "discourse_username": { "type": "string", "required": true },
      "farcaster_username": { "type": "string", "required": true },
      "proposal_category_preference": { "type": "string", "required": true }
    }
  },
  "enums": {},
  "accountData": {
    "nounishProfile": { "type": "node", "name": "NounishProfile" }
  }
}