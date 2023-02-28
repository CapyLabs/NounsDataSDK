import { TODO_REQUIRED_KEYS, INT_TYPES, IGNORE_FIELDS } from "./queries.mjs";

// This function is essentially going to become
// https://github.com/CapyLabs/eventspy/blob/main/GetEvents.py#L40
export const convertTheGraphProposalToCeramicProposal = (thegraph_proposal) => {
  // console.log('full thegraph_proposal: \n%s\n\n', thegraph_proposal)
  let ceramic_proposal = {};
  for (var [key, value] of Object.entries(thegraph_proposal)) {

    if (INT_TYPES.includes(key)) {
      value = parseInt(value);
    }

    if (IGNORE_FIELDS.includes(key)) {
      continue;
    }

    if (key == 'id') {
      key = 'proposal_id';
    }

    ceramic_proposal[key] = value;
  }

  // TODO: Fix model to not include these
  for (var [key, value] of Object.entries(TODO_REQUIRED_KEYS)) {
    ceramic_proposal[key] = value;
  }

  const proposer = thegraph_proposal['proposer']['id'];
  ceramic_proposal['proposer'] = proposer;
  ceramic_proposal['description'] = ceramic_proposal['description'].substring(0, 20000);

  return ceramic_proposal;
};

export const convertTheGraphProposalToCeramicVotes = (thegraph_proposal, proposal_ceramic_id) => {
  let votes = [];

  // console.log('thegraph_proposal: \n\n%s\n\n\n' + JSON.stringify(thegraph_proposal))
  const real_votes = thegraph_proposal['votes'];
  for (const real_vote of real_votes) {
    const vote_theGraph_format = {
      'proposal_stream_id': proposal_ceramic_id,
      'eth_address': real_vote['voter']['id'],
      'blocknumber': parseInt(real_vote['blockNumber']),
      'vote_id': real_vote['id'],
      'reason': '',
      'support': real_vote['support'],
      'supportDetailed': real_vote['supportDetailed'],
      'votes': parseInt(real_vote['votes']),
      'votesRaw': parseInt(real_vote['votesRaw'])
    };
    votes.push(vote_theGraph_format);
  }
  return votes;
};
