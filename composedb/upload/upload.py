
#  pip3 install psycopg2-binary
import psycopg2

import argparse
import configparser
import requests
import json

# 1. Get the ComposeDb proposals that are not Executed/Canceled
# 2. Get the postgres table nouns_proposals rows for those proposal_ids
# 3. Write to ComposeDb, updating those proposals, with new values 

from queries import CERAMIC_PUBLISH_JSON
from queries import CERAMIC_GET_JSON
from queries import CERAMIC_UPDATE_JSON
from queries import THEGRAPH_GET_PROPOSALS
from queries import TEST_RESPONSE_THEGRAPH
from queries import CERAMIC_BASE_PROPOSAL_OBJ
from queries import CERAMIC_PUBLISH_JSON_TEMPLATE
from queries import CERAMIC_UPDATE_TEMPLATE_JSON

DRY_RUN = False
HEADERS = {
    "Content-Type": "application/json"
}


def call_thegraph():
  url_lilnouns_thegraph = "https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph"
  response = requests.post(url_lilnouns_thegraph, json=THEGRAPH_GET_PROPOSALS, headers=HEADERS)
  return response.json()['data']['proposals']


def call_ceramic(ceramic_endpoint):
  response = requests.post(ceramic_endpoint, json=CERAMIC_GET_JSON, headers=HEADERS)
  response.raise_for_status()
  if response.status_code != 200:
      print(str(response))
      raise Exception("Failed to execute query")
  data = response.json()['data']['nounsProposalIndex']['edges']
  return data


# Map thegraph response to ceramic model key & values
THEGRAPH_CERAMIC_KEY_MAP = {
  'createdBlock': 'blocknumber',
  'createdTimestamp': 'createdTimestamp',
  'id': 'proposal_id',
  #'values': 'requested_eth', # This is an array
  #'total_votes': '', # Add these up
  'status': 'state',
  'forVotes': 'votes_for',
  'againstVotes': 'votes_against',
  'abstainVotes': 'votes_abstain',
  'description': 'description'
}


def create_ceramic_proposal(groundtruth_proposal):
  ceramic_proposal_obj = CERAMIC_BASE_PROPOSAL_OBJ
  for k, v in groundtruth_proposal.items():
    if k in THEGRAPH_CERAMIC_KEY_MAP.keys():
      ceramic_proposal_obj[THEGRAPH_CERAMIC_KEY_MAP[k]] = v

  obj = CERAMIC_PUBLISH_JSON_TEMPLATE
  obj['variables']['proposal']['content'] = ceramic_proposal_obj

  print('\n\nfinal proposal object in ceramic format: ' + str(obj))
  # TODO: RPC



def update_ceramic_proposal(ceramic_id, groundtruth_proposal):
  BASE_OBJ = {
    'id': ceramic_id,
    'content': {
      # ...
    }
  }

  ceramic_proposal_obj = BASE_OBJ
  for k, v in groundtruth_proposal.items():
    if k in THEGRAPH_CERAMIC_KEY_MAP.keys():
      ceramic_proposal_obj[THEGRAPH_CERAMIC_KEY_MAP[k]] = v

  obj = CERAMIC_UPDATE_TEMPLATE_JSON
  obj['variables']['proposal'] = ceramic_proposal_obj

  # TODO: RPC
  print('\n\nfinal proposal object in ceramic format: ' + str(ceramic_proposal_obj))


  """
  CERAMIC OBJECT:
  proposal_obj = {
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

  
  THEGRAPH OBJECT: 
  "id":"91",
   "createdBlock": "16335655",
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
  """

  pass


def build_proposal_id_to_ceramic_id_map(uploaded_proposals):
    map_proposal_id_to_ceramic_id = {}
    for ceramic_proposal in uploaded_proposals:
      proposal_obj = ceramic_proposal['node']
      map_proposal_id_to_ceramic_id[proposal_obj['proposal_id']] = proposal_obj['id']
    return map_proposal_id_to_ceramic_id


def main():
    global DRY_RUN
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', help='Perform a dry run without making any changes')
    args = parser.parse_args()
    DRY_RUN = args.dry_run

    config = configparser.ConfigParser()
    config.read('config.ini')

    ceramic_endpoint = config['DEFAULT']['CeramicGraphQlEndpoint']

    latest_proposals = call_thegraph()
    print('Loaded ' + str(len(latest_proposals)) + ' proposals from thegraph')

    uploaded_proposals = call_ceramic(ceramic_endpoint)
    print('Loaded ' + str(len(uploaded_proposals)) + ' proposals from ceramic')

    # For each proposal
    # Check if in ceramic by id
    # If not in ceramic, create
    # If in ceramic, update

    map_proposal_id_to_ceramic_id = build_proposal_id_to_ceramic_id_map(uploaded_proposals)
    already_uploaded_proposal_ids = map_proposal_id_to_ceramic_id.keys()

    for groundtruth_proposal in latest_proposals:

      if groundtruth_proposal['id'] not in already_uploaded_proposal_ids:
        print('Create new ceramic stream for proposal id ' + str(groundtruth_proposal['id']))
        # Create new ceramic proposal
        create_ceramic_proposal(groundtruth_proposal)
        pass
      else:
        ceramic_id = map_proposal_id_to_ceramic_id[groundtruth_proposal['id']]
        print('Update proposal id %d, ceramic id %s ' % (groundtruth_proposal['id'], ceramic_id))
        # Update existing ceramic proposal
        # Maybe check if voting ended already
        update_ceramic_proposal(ceramic_id, groundtruth_proposal)
        pass


if __name__ == '__main__':
    main()

