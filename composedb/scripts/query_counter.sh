curl http://localhost:5001/graphql -X POST -H 'content-type: application/json'  -d '{"query":"query { counterIndex(first:10){edges { node { c
ount } }} }"}'