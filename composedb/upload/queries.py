
# {"query":"query { nounsProposalIndex(first:10){edges { node { id } }} }"}

CERAMIC_GET_JSON = {
	"query": """query { nounsProposalIndex(first:10){edges { node { id } }} }"""	
}


# TODO: This needs variables and be a template
# https://dgraph.io/docs/graphql/mutations/update/#set
# https://composedb.js.org/docs/preview/interact-with-data



CERAMIC_GET_ONE_JSON = {
	"query": """mutation UpdateNounsProposal($proposal: UpdateNounsProposalInput!) {
			updateNounsProposal(input: $proposal) {
			  document{ 
			    total_votes
			  }
			}
		}""",
	"variables": {
		"proposal": {
			"id": "",
			"content": {
			  "total_votes": 2
			}
		}
	}
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