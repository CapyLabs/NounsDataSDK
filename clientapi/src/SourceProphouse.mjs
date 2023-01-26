
const QUERY_PROPOSALS = `
{
  auctionsByStatus(status:Closed) {
    id
    title
    proposals {
      id
      address
      title
      voteCount
    }
  }
}

`

// This one isn't working anymore
//const PROPHOUSE_URL = 'https://prod.backend.prop.house/communities/name/lil%20nouns'


const PROPHOUSE_URL = 'https://prod.backend.prop.house/graphql'

export const getPropHouse = async () => {
	const response = await fetch(PROPHOUSE_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: QUERY_PROPOSALS 
		})
	})

	const responseObject = JSON.parse(await response.text())
	console.log(JSON.stringify(responseObject))

	responseObject['data']['auctionsByStatus'].forEach((round) => {

		//round['proposals'].forEach((prop) => {

			//const timestamp = parseInt("" + new Date(prop['createdDate']).valueOf() / 1000)
			//const url = 'https://prop.house/lil-nouns'
		console.log(JSON.stringify(round))
	})
}








