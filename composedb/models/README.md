# ComposeDB models

The `.graphql` files in this folder define the models deployed to ComposeDB.

## Deploying a model

Create composite from schema:
```
$ composedb composite:create nounish_profile.graphql --output=generated/nounish_profile_composite.json -k=$private_key
```
Deploy composite:
```
$ composedb composite:deploy generated/nounish_profile_composite.json -k=$private_key
```

Merging composite files:
```
$ composedb composite:merge generated/nounish_profile_composite.json generated/other_composite.json --output=generated/merged_composite.json
```

Compile merged composite into runtime composite:
```
$ composedb composite:compile generated/merged_composite.json generated/merged_runtime_composite.json
```
Print the schema for the composite:
```
$ composedb graphql:schema generated/merged_runtime_composite.json
```

Serve merged composite on GraphiQL server:
```
$ composedb graphql:server --graphiql --port=5001 generated/merged_runtime_composite.json --did-private-key=$private_key
```