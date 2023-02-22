echo 'Creating and deploying'

echo '- nouns_proposal.graphql'
composedb composite:create nouns_proposal.graphql --output=generated/nouns_proposal_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
composedb composite:deploy generated/nouns_proposal_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

echo '- nouns_proposal_vote.graphql'
composedb composite:create nouns_proposal_vote.graphql --output=generated/nouns_proposal_vote_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
composedb composite:deploy generated/nouns_proposal_vote_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

echo '- nounish_profile.graphql'
composedb composite:create nounish_profile.graphql --output=generated/nounish_profile_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
composedb composite:deploy generated/nounish_profile_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

# echo 'prophouse_auction.graphql'
# composedb composite:create prophouse_auction.graphql --output=generated/prophouse_auction_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
# composedb composite:deploy generated/prophouse_auction_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

# TODO: Prophouse_community, prophouse_proposal

echo 'Merging composites'
composedb composite:merge generated/merged_composites.json generated/nouns_proposal_composite.json --output=generated/merged_composites.json
composedb composite:merge generated/merged_composites.json generated/nouns_proposal_vote_composite.json --output=generated/merged_composites.json
composedb composite:merge generated/merged_composites.json generated/nounish_profile_composite.json --output=generated/merged_composites.json

echo 'Compiling merged composite'
composedb composite:compile generated/merged_composite.json generated/merged_runtime_composite.json

echo 'Remaining action items:'
echo '- copy merged_runtime_composite into /library/src/__generated__/ and restart graphql if needed'
echo '- update model instance ids in scripts and graphql files'

# composedb composite:merge generated/merged_composites.json generated/nouns_proposal_vote.json --output=generated/merged_composites.json