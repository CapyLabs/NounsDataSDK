

# https://dgraph.io/docs/graphql/mutations/update/#set
# https://composedb.js.org/docs/preview/interact-with-data


THEGRAPH_GET_PROPOSALS = {"query": """{
    proposals(orderBy: createdTimestamp, orderDirection: desc) {
      id
      createdBlock
      description
      status
      createdTimestamp
      abstainVotes
      againstVotes
      executionETA
      forVotes
      proposalThreshold
      targets
      values
      votes {
        id
        votes
        voter {
          id
        }
        votesRaw
      }
    }
  }"""}

CERAMIC_GET_JSON = {
	"query": """query { nounsProposalIndex(last:1000) {edges { node { 
		id 
	  	blocknumber
	    proposal_id
	    state
	} }} }"""	
}


CERAMIC_UPDATE_JSON = {
	"query": """mutation UpdateNounsProposal($proposal: UpdateNounsProposalInput!) {
			updateNounsProposal(input: $proposal) {
			  document{ 
			    total_votes
			  }
			}
		}""",
	"variables": {
		"proposal": {
			"id": "kjzl6kcym7w8y6xvzuqpfviyatgr0ngrsz9axxtith8p2eo37ygimkb338mz3ok",
			"content": {
			  "total_votes": 2
			}
		}
	}
}


CERAMIC_UPDATE_TEMPLATE_JSON = {
  "query": """mutation UpdateNounsProposal($proposal: UpdateNounsProposalInput!) {
      updateNounsProposal(input: $proposal) {
        document{ 
          blocknumber
          createdTimestamp
          proposal_id
          state
          votes_for
          votes_against
          votes_abstain
          description
        }
      }
    }""",
  "variables": {
    "proposal": {
      "id": "kjzl6kcym7w8y6xvzuqpfviyatgr0ngrsz9axxtith8p2eo37ygimkb338mz3ok",
      "content": {
        
      }
    }
  }
}


CERAMIC_PUBLISH_JSON = {
    "query": """mutation CreateNounsProposal($proposal: CreateNounsProposalInput!) {
          createNounsProposal(input: $proposal) {
            document {
              blocknumber
              created_timestamp
              unique_holders
              total_supply
              proposal_id
              requested_eth
              start_block
              end_block
              total_votes
              total_distinct_voters
              quorum_required
              votes_for
              distinct_voters_for
              votes_against
              distinct_voters_against
              votes_abstain
              distinct_votes_abstain
              proposer
              transactionhash
              description
              state
            }
        }
    }""",
    "variables": {
         "proposal": {
            "content": {
              "blocknumber": 1,
              "created_timestamp": 1672282957,
              "unique_holders": 1,
              "total_supply": 1,
              "proposal_id": 1,
              "requested_eth": 0,
              "start_block": 1,
              "end_block": 2,
              "total_votes": 1,
              "total_distinct_voters": 1,
              "quorum_required": 1,
              "votes_for": 1,
              "distinct_voters_for": 1,
              "votes_against": 0,
              "distinct_voters_against": 0,
              "votes_abstain": 0,
              "distinct_votes_abstain": 0,
              "proposer": "0xabcdef123456",
              "transactionhash": "0x987654321",
              "description": "Proposal to increase the total supply of tokens",
              "state": "OPEN"
            }
          }
    }
}


CERAMIC_PUBLISH_JSON_TEMPLATE = {
    "query": """mutation CreateNounsProposal($proposal: CreateNounsProposalInput!) {
          createNounsProposal(input: $proposal) {
            document {
              blocknumber
              created_timestamp
              unique_holders
              total_supply
              proposal_id
              requested_eth
              start_block
              end_block
              total_votes
              total_distinct_voters
              quorum_required
              votes_for
              distinct_voters_for
              votes_against
              distinct_voters_against
              votes_abstain
              distinct_votes_abstain
              proposer
              transactionhash
              description
              state
            }
        }
    }""",
    "variables": {
         "proposal": {
            "content": {
              "blocknumber": 1,
              "created_timestamp": 1672282957,
              "unique_holders": 1,
              "total_supply": 1,
              "proposal_id": 1,
              "requested_eth": 0,
              "start_block": 1,
              "end_block": 2,
              "total_votes": 1,
              "total_distinct_voters": 1,
              "quorum_required": 1,
              "votes_for": 1,
              "distinct_voters_for": 1,
              "votes_against": 0,
              "distinct_voters_against": 0,
              "votes_abstain": 0,
              "distinct_votes_abstain": 0,
              "proposer": "0xabcdef123456",
              "transactionhash": "0x987654321",
              "description": "Proposal to increase the total supply of tokens",
              "state": "OPEN"
            }
          }
    }
}

CERAMIC_BASE_PROPOSAL_OBJ = {
    "blocknumber": 1,
    "created_timestamp": 1,
    "unique_holders": 1,
    "total_supply": 1,
    "proposal_id": 1,
    "requested_eth": 0,
    "start_block": 1,
    "end_block": 1,
    "total_votes": 1,
    "total_distinct_voters": 1,
    "quorum_required": 1,
    "votes_for": 1,
    "distinct_voters_for": 1,
    "votes_against": 0,
    "distinct_voters_against": 0,
    "votes_abstain": 0,
    "distinct_votes_abstain": 0,
    "proposer": "0x0",
    "transactionhash": "0x0",
    "description": "",
    "state": "INVALID"
  }


TEST_RESPONSE_THEGRAPH = [
{
	"id":"91",
	"description":"# Unique IRL Proliferation at 420 Tasty Trivia Events\n\n\n## A Lil Nouns Sponsorship Proposal\n\n\n## TLDR: 6.9 ETH to sponsor and brand 420 Tasty Trivia Events as Lil Nounish\n(That’s just .016 ETH per event! This would be roughly a 6-month activation)\n\n*Robust version:*\n\nThere are so many ways to proliferate the meme and brand of Lil Nouns, so this proposal drives that attention toward already established IRL events in the Central Florida area. Tasty Trivia has been operating live trivia and bingo events throughout the greater Orlando area since 2012 and currently has consistent weekly events, special monthly theme events, and a flow of events running constantly. \n\nMarketing is all about visibility and consistency, ultimately going after the attention of the end user. In this proliferation activation, Lil Nouns, the Noggles, and a variety of memes will be used in the following ways:\n\n- Noggles and Lil Nouns web URL on trivia sheets used by teams\n- Noggles and Lil Nouns web URL on Facebook events promoting the nights\n- Noggles and Lil Nouns web URL on website events (see website traffic graphic below)\n- Images of winners and hosts with Noggles\n\n### Summary/Backstory of Tasty Trivia:\n\nTasty Trivia is Entertainment Marketing. From connecting amazing talent to the venues that want live events to online engagement, Tasty Trivia specializes in utilizing fun, interactive games as marketing tools to promote products, increase sales, and generate visibility across internet platforms and physical locations.\n\nWe strive to produce some of the most appealing, transaction-driven entertainment available anywhere, specializing in small business growth and development.\n\n### One Month of Tasty Trivia Website Traffic:\n\n![](https://i.imgur.com/uUleLQm.png)\n\n\n### 2022 Website Traffic for Tasty Trivia:\n\n![](https://i.imgur.com/6FbUSqN.png)\n\n### Facebook:\n\n[![](https://i.imgur.com/Eq6hBDL.jpg)\n](https://)\n\nCheck out this 5-minute run down of me showing you exactly what I mean and where:\n\nhttps://youtu.be/RUrhI04P7go\n\n\n## Scope\n\nProliferation of the brand across 420 events in Central Florida. We estimate this to be just about 6 months of events, some months have closer to 80 while others are closer to 65. The Noggles and Lil Nouns visibility will be prominent across:\n\n- trivia sheets\n- online promotion\n- images of nounish activities\n\nThe goal of this proposal is anchoring the nounish vibes with irl events that are consistently occurring each week at venues throughout the Orlando area. \n\nConsistency and repetition. Consistency and repetition. This is how we can impact new individuals to build curiosity and engagement toward onboarding new and interesting people.\n\nDiscussion in #Proposal-Ideas: [(Let's Chat!)](https://discord.com/channels/954142017556979752/1041907327084810280/1041907327084810280)\n\n## Funds Requested\n\nTotal: 6.9 ETH to sponsor 420 events\n\n\n",
	"status":"ACTIVE",
	"createdTimestamp":"1672862171",
	"abstainVotes":"0",
	"againstVotes":"7",
	"executionETA":"None",
	"forVotes":"281",
	"proposalThreshold":"6",
	"targets":[
	   "0xa61ccf8f01af0414fb5c0ced4060881e4916117c"
	],
	"values":[
	   "6900000000000000000"
	]
}]


TEST_CERAMIC_GET_ONE_JSON = {
	"query": """
query { node(id: "kjzl6kcym7w8y6xvzuqpfviyatgr0ngrsz9axxtith8p2eo37ygimkb338mz3ok") {
		  id
	}
   }"""	
}

