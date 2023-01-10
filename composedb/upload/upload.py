
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


def create_ceramic_proposal(groundtruth_proposal, ceramic_endpoint):
  ceramic_proposal_obj = CERAMIC_BASE_PROPOSAL_OBJ
  for k, v in groundtruth_proposal.items():
    if k in THEGRAPH_CERAMIC_KEY_MAP.keys():
      ceramic_proposal_obj[THEGRAPH_CERAMIC_KEY_MAP[k]] = v

  obj = CERAMIC_PUBLISH_JSON_TEMPLATE
  obj['variables']['proposal']['content'] = ceramic_proposal_obj

  print('\n\nfinal proposal object in ceramic format: ' + str(obj))
  # TODO: RPC

  if DRY_RUN:
    return None

  response = requests.post(ceramic_endpoint, json=obj, headers=HEADERS)
  response.raise_for_status()
  if response.status_code != 200:
      print(str(response))
      raise Exception("Failed to execute query")

  data = response.json()['data']
  print('create_ceramic_proposal response: ' + str(data))
  return data


def update_ceramic_proposal(ceramic_id, groundtruth_proposal, ceramic_endpoint):
  BASE_OBJ = {
    'id': ceramic_id,
    'content': {
      # ... 
    }
  }

  # THEGRAPH_CERAMIC_KEY_MAP and CERAMIC_UPDATE_TEMPLATE_JSON
  # must have the same keys

  ceramic_proposal_obj = BASE_OBJ
  for k, v in groundtruth_proposal.items():
    if k in THEGRAPH_CERAMIC_KEY_MAP.keys():
      ceramic_proposal_obj['content'][THEGRAPH_CERAMIC_KEY_MAP[k]] = v

  obj = CERAMIC_UPDATE_TEMPLATE_JSON
  obj['variables']['proposal'] = ceramic_proposal_obj

  # TODO: RPC
  print('\n\nfinal proposal object in ceramic format: ' + str(ceramic_proposal_obj))

  if DRY_RUN:
    return None

  response = requests.post(ceramic_endpoint, json=obj, headers=HEADERS)
  response.raise_for_status()
  if response.status_code != 200:
      print(str(response))
      raise Exception("Failed to execute query")

  data = response.json()['data']
  print('update_ceramic_proposal response: ' + str(data))
  return data



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

