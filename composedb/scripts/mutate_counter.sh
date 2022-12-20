curl http://localhost:5001/graphql -X POST -H 'content-type: application/json'  -d '{"query":"mutation { createCounter(input: { content: {count: 3}}){ document {count} }  }"}'
