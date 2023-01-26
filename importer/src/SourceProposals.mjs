
const LILNOUNS_GRAPHQL = 'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph' 
const QUERY_PROPOSALS = `
{
  proposals(orderBy: createdTimestamp, orderDirection: desc) {
    id
    createdBlock
    createdTimestamp
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
  auction(id: "") {
    amount
    bidder {
      id
    }
    bids {
      amount
    }
  }
}`


export const getProposals = async () => {
	const response = await fetch(LILNOUNS_GRAPHQL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: QUERY_PROPOSALS 
		})
	})

	let proposals = []

	const responseObject = await response.json()

	for (const proposal of responseObject['data']['proposals']) {
		 proposals.push(proposal)
	}

	return proposals
}
