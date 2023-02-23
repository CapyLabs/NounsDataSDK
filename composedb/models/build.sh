target_dir = 'generated2' #'generated'

echo 'Creating and deploying'

echo '- nouns_proposal.graphql'
composedb composite:create nouns_proposal.graphql --output=$target_dir/nouns_proposal_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
composedb composite:deploy $target_dir/nouns_proposal_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

read -p "Please update nouns_proposal_vote.graphql with the new nouns_proposal model id"

echo '- nouns_proposal_vote.graphql'
composedb composite:create nouns_proposal_vote.graphql --output=$target_dir/nouns_proposal_vote_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
composedb composite:deploy $target_dir/nouns_proposal_vote_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

read -p "Please update nouns_proposal_vote_relationship.graphql with the new nouns_proposal model id AND nouns_proposal_vote model id"

composedb composite:create nouns_proposal_vote_relationship.graphql --output=$target_dir/nouns_proposal_vote_relationship_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
composedb composite:deploy $target_dir/nouns_proposal_vote_relationship_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

read -p "Please check there is no errors so far"


echo 'Merging composites'
composedb composite:merge $target_dir/merged_composites.json $target_dir/nouns_proposal_composite.json --output=$target_dir/merged_composites.json
composedb composite:merge $target_dir/merged_composites.json $target_dir/nouns_proposal_vote_composite.json --output=$target_dir/merged_composites.json
composedb composite:merge $target_dir/merged_composites.json $target_dir/nouns_proposal_vote_relationship_composite.json --output=$target_dir/merged_composites.json


read -p "Please check there is no errors so far"


echo 'Compiling merged composite'
composedb composite:compile $target_dir/merged_composite.json $target_dir/merged_runtime_composite.json

echo 'Remaining action items:'
echo '- copy merged_runtime_composite into /library/src/__generated__/ and restart graphql if needed'
echo '- update model instance ids in scripts'




# TODO: 

#echo '- nounish_profile.graphql'
#composedb composite:create nounish_profile.graphql --output=generated/nounish_profile_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
#composedb composite:deploy generated/nounish_profile_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

# echo 'prophouse_auction.graphql'
# composedb composite:create prophouse_auction.graphql --output=generated/prophouse_auction_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688
# composedb composite:deploy generated/prophouse_auction_composite.json -k=bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688

# composedb composite:merge generated/merged_composites.json generated/nounish_profile_composite.json --output=generated/merged_composites.json


# TODO: Prophouse_community, prophouse_proposal

# composedb composite:merge generated/merged_composites.json generated/nouns_proposal_vote.json --output=generated/merged_composites.json