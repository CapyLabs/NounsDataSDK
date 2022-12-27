
#  pip3 install psycopg2-binary
import psycopg2
import configparser
import requests
import json

def call_graphql_service(ceramic_endpoint):

    headers = {
        "Content-Type": "application/json"
    }

    with open("ceramic_get.graphql", "r") as f:
        query = f.read()

    #payload = {
    #    "query": query
    #}
    payload = json.loads(query)
    print(str(payload))
    response = requests.post(ceramic_endpoint, json=payload, headers=headers)
    response.raise_for_status()
    if response.status_code != 200:
        print(str(response))
        raise Exception("Failed to execute query")

    data = response.json()

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
