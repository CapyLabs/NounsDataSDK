
#  pip3 install psycopg2-binary
import psycopg2
import configparser
import requests
import json

# 1. Get the ComposeDb proposals that are not Executed/Canceled
# 2. Get the postgres table nouns_proposals rows for those proposal_ids
# 3. Write to ComposeDb, updating those proposals, with new values 

# Use The Graph API for this

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

def call_graphql_service(ceramic_endpoint):

    headers = {
        "Content-Type": "application/json"
    }

    with open("ceramic_publish.graphql", "r") as f:
        query = f.read()

    #payload = {
    #    "query": query
    #}
    #payload = json.loads(query)
    payload = CERAMIC_PUBLISH_JSON #json.loads(CERAMIC_PUBLISH_JSON)

    print(str(payload))
    response = requests.post(ceramic_endpoint, json=payload, headers=headers)
    response.raise_for_status()
    if response.status_code != 200:
        print(str(response))
        raise Exception("Failed to execute query")

    print('\n\n\n')
    data = response.json()
    print(str(data))

    for key, value in data.items():
        print(key, ":", value)


def read_nouns_proposals(conn):
    cursor = conn.cursor()

    with open("nouns_proposals.sql", "r") as f:
        query = f.read()

    # print(str(query))
    cursor.execute(query)

    rows = cursor.fetchall()
    for row in rows:
        pass
    #    print(row)

    # Get the latest blocknumbre from Ceramic. Any rows with new 
    # blocknumbers should be written with ceramic with http call

    cursor.close()

def main():
    config = configparser.ConfigParser()
    config.read('config.ini')

    db_name = config['DEFAULT']['DatabaseName']
    db_user = config['DEFAULT']['DatabaseUser']
    db_password = config['DEFAULT']['DatabasePassword']
    db_host = config['DEFAULT']['DatabaseHost']
    db_port = config['DEFAULT']['DatabasePort']

    ceramic_endpoint = config['DEFAULT']['CeramicGraphQlEndpoint']

    conn = None
    try:
        call_graphql_service(ceramic_endpoint)

        conn = psycopg2.connect(database=db_name, user=db_user, password=db_password, host=db_host, port=db_port)
        read_nouns_proposals(conn)
        
        conn.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    main()
