
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


def call_ceramic(ceramic_endpoint):
    response = requests.post(ceramic_endpoint, json=CERAMIC_GET_JSON, headers=HEADERS)
    response.raise_for_status()
    if response.status_code != 200:
        print(str(response))
        raise Exception("Failed to execute query")

    print('\n\n\n')
    data = response.json()['data']['nounsProposalIndex']['edges']
    print(str(data))

    return data


def call_thegraph():
  url_lilnouns_thegraph = "https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph"
  print(str(TEST_RESPONSE_THEGRAPH))

  if DRY_RUN:
    return TEST_RESPONSE_THEGRAPH

  response = requests.post(url_lilnouns_thegraph, json=THEGRAPH_GET_PROPOSALS, headers=HEADERS)
  print(str(response.json()))
  print('DRY_RUN: ' + str(DRY_RUN))
  return response.json()['data']['proposals']


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


if __name__ == '__main__':
    main()

