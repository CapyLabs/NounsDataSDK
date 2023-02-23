#!/bin/bash

TARGET_DIR='generated2' #'generated'
ADMIN_KEY='bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688'

echo 'Creating and deploying'


# NounsProposal
echo '- nouns_proposal.graphql'
composedb composite:create nouns_proposal.graphql --output=./$TARGET_DIR/nouns_proposal_composite.json -k=$ADMIN_KEY
composedb composite:deploy ./$TARGET_DIR/nouns_proposal_composite.json -k=$ADMIN_KEY

echo "Please update nouns_proposal_vote.graphql with the new nouns_proposal model id"
read _


# NounsProposalVote
echo '- nouns_proposal_vote.graphql'
composedb composite:create nouns_proposal_vote.graphql --output=./$TARGET_DIR/nouns_proposal_vote_composite.json -k=$ADMIN_KEY
composedb composite:deploy ./$TARGET_DIR/nouns_proposal_vote_composite.json -k=$ADMIN_KEY

echo "Please update nouns_proposal_vote_relationship.graphql with the new nouns_proposal model id AND nouns_proposal_vote model id"
read _

composedb composite:create nouns_proposal_vote_relationship.graphql --output=./$TARGET_DIR/nouns_proposal_vote_relationship_composite.json -k=$ADMIN_KEY
composedb composite:deploy ./$TARGET_DIR/nouns_proposal_vote_relationship_composite.json -k=$ADMIN_KEY

echo "Please check there is no errors so far"
read _


# NounishProfile
echo '- nounish_profile.graphql'
composedb composite:create nounish_profile.graphql --output=./$TARGET_DIR/nounish_profile_composite.json -k=$ADMIN_KEY
composedb composite:deploy ./$TARGET_DIR/nounish_profile_composite.json -k=$ADMIN_KEY

echo "Please check there is no errors so far"
read _


# Merging 
echo 'Merging composites'
composedb composite:merge ./$TARGET_DIR/merged_composites.json ./$TARGET_DIR/nouns_proposal_composite.json --output=./$TARGET_DIR/merged_composites.json
composedb composite:merge ./$TARGET_DIR/merged_composites.json ./$TARGET_DIR/nouns_proposal_vote_composite.json --output=./$TARGET_DIR/merged_composites.json
composedb composite:merge ./$TARGET_DIR/merged_composites.json ./$TARGET_DIR/nouns_proposal_vote_relationship_composite.json --output=./$TARGET_DIR/merged_composites.json
composedb composite:merge ./$TARGET_DIR/merged_composites.json ./$TARGET_DIR/nounish_profile_composite.json --output=./$TARGET_DIR/merged_composites.json

echo "Please check there is no errors so far"
read _


# Compiling
echo 'Compiling merged composite'
composedb composite:compile ./$TARGET_DIR/merged_composite.json ./$TARGET_DIR/merged_runtime_composite.json

echo 'Remaining action items:'
echo '- copy merged_runtime_composite into /library/src/__generated__/ and restart graphql if needed'
echo '- update model instance ids in scripts'




# TODO: 

#echo '- nounish_profile.graphql'
#composedb composite:create nounish_profile.graphql --output=generated/nounish_profile_composite.json -k=$ADMIN_KEY
#composedb composite:deploy generated/nounish_profile_composite.json -k=$ADMIN_KEY

# echo 'prophouse_auction.graphql'
# composedb composite:create prophouse_auction.graphql --output=generated/prophouse_auction_composite.json -k=$ADMIN_KEY
# composedb composite:deploy generated/prophouse_auction_composite.json -k=$ADMIN_KEY

# composedb composite:merge generated/merged_composites.json generated/nounish_profile_composite.json --output=generated/merged_composites.json


# TODO: Prophouse_community, prophouse_proposal

# composedb composite:merge generated/merged_composites.json generated/nouns_proposal_vote.json --output=generated/merged_composites.json