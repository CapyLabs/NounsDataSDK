
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
        pass
      else:
        ceramic_id = map_proposal_id_to_ceramic_id[groundtruth_proposal['id']]
        print('Update proposal id %d, ceramic id %s ' % (groundtruth_proposal['id'], ceramic_id))
        # Update existing ceramic proposal
        # Maybe check if voting ended already
        pass


if __name__ == '__main__':
    main()

