

const LILNOUNS_GRAPHQL = 'https://hub.snapshot.org/graphql' //'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph'
const QUERY_PROPOSALS = `
query Proposals {
  proposals(
    first: 20,
    skip: 0,
    where: {
      space_in: ["al409.eth"],
      state: "closed"
    },
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}`

export const getSnapshot = async () => {
		const response = await fetch(LILNOUNS_GRAPHQL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: QUERY_PROPOSALS 
			})
		})
		const responseObject = await response.json()


    for(const proposal of responseObject['data']['proposals']) {
      console.log(JSON.stringify(proposal))
      //const url = 'https://snapshot.org/#/al409.eth/proposal/' + proposal['id']
      //console.log(proposal['start'] + ',snapshot,' + url + ',\"' + proposal['title'] + '\"')
    }
	}

