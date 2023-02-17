import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";
import { type DocumentNode, type ExecutionResult, type Source } from 'graphql';

import { QUERY_GET_VIEWER_NOUNISH_PROFILE, QUERY_GET_PROPOSALS, QUERY_GET_PROPOSAL_VOTES, QUERY_GET_PROPHOUSE_PROPOSALS, NounishProfileResponse, CreateNounishProfileResponse } from "./queries.js";
import { QUERY_GET_PROPOSALS_PAGINATED_FIRST, QUERY_GET_PROPOSALS_PAGINATED_FIRST_AFTER } from "./queries.js";
import { QUERY_GET_PROPHOUSE_PROPOSALS_PAGINATED_FIRST, QUERY_GET_PROPHOUSE_PROPOSALS_PAGINATED_FIRST_AFTER } from "./queries.js";

import { definition } from "./__generated__/definition.js";
import { NounishProfile } from "../model/NounishProfile.js"

export class NounsDataClient {
  composeClient: ComposeClient;

  constructor() {
    this.composeClient = new ComposeClient({
      ceramic: "https://nounsdata.wtf:7007",
      definition: definition as RuntimeCompositeDefinition
    });
  }

  public isAuthenticated(): boolean {
    return this.composeClient.did !== undefined
  }

  public async authenticate(seed: string) {
    const key = fromString(
      seed,
      "base16"
    );
    const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(key)
    })
    await did.authenticate()
    this.composeClient.setDID(did)
  }

  public async getAuthenticatedNounishProfile(): Promise<NounishProfile> {
    if (!this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        reject("Must authenticate before calling getAuthenticatedNounishProfile")
      })
    }

    return this.composeClient
      .executeQuery(QUERY_GET_VIEWER_NOUNISH_PROFILE)
      .then(
        (value) =>
          new Promise((resolve, reject) => {
            if (value.errors) {
              reject(value.errors)
            } else {
              const response = value as NounishProfileResponse
              resolve(response.data.viewer.nounishProfile);
            }
          })
      )
  }

  public async writeAuthenticatedNounishProfile(profile: NounishProfile): Promise<NounishProfile> {
    if (!this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        reject("Must authenticate before calling writeAuthenticatedNounishProfile")
      })
    }

    return this.composeClient.executeQuery(`        
      mutation {
        createNounishProfile(input: {
          content: {
            eth_address: "${profile.eth_address}"
            time_zone: "${profile.time_zone}"
            discord_username: "${profile.discord_username}"
            twitter_username: "${profile.twitter_username}"
            discourse_username: "${profile.discourse_username}"
            farcaster_username: "${profile.farcaster_username}"
            proposal_category_preference: "${profile.proposal_category_preference}"
          }
        }) 
        {
          document {
            eth_address
            time_zone
            discord_username
            twitter_username
            discourse_username
            farcaster_username
            proposal_category_preference
          }
        }
      }`)
      .then(
        (value) =>
          new Promise((resolve, reject) => {
            if (value.errors) {
              reject(value.errors)
            } else {
              const response = value as CreateNounishProfileResponse
              resolve(response.data.createNounishProfile.document);
            }
          })
      )
  }

  public getCeramicProposals(): Promise<ExecutionResult<any>> {
    return this.composeClient.executeQuery(QUERY_GET_PROPOSALS)
  }

  public async getCeramicProposalsPaginated(): Promise<any> {
    const step: Number = 50

    let query = QUERY_GET_PROPOSALS_PAGINATED_FIRST
    query = query.replace('INT_FIRST', step + "")

    let pageInfo: any = {
      'hasNextPage': false
    }

    // TODO: Append to result vector
    let counter = 0

    do {

      let page = await this.composeClient.executeQuery(query)
      pageInfo = page!['data']!['nounsProposalIndex']
      pageInfo = pageInfo['pageInfo']

      query = QUERY_GET_PROPOSALS_PAGINATED_FIRST_AFTER
      query = query.replace('INT_FIRST', step + "")
      query = query.replace('STRING_AFTER', pageInfo['endCursor'])

      counter += 1
      console.log('- ' + pageInfo['hasNextPage'])

      // Todo append page to result list
    } while(pageInfo['hasNextPage'])

    return counter
  }

  public async upsertProposal(ceramicId: any, proposal: any) {
    const upsert_proposal_query = `
      mutation UpdateNounsProposal($proposal: UpdateNounsProposalInput!) {
        updateNounsProposal(input: $proposal) {
          document{ 
            abstainVotes
            againstVotes
            calldatas
            createdBlock
            createdTimestamp
            createdTransaction
            description
            endBlock
            forVotes
            proposal_id
            proposalThreshold
            proposer
            quorumCoefficient
            quorumVotes
            signatures
            startBlock
            status
            targets
            totalSupply
            values
            daoName
          }
        }
      }`

    const upsert_proposal_variables = {
      "proposal": {
        "id": ceramicId,
        "content": proposal
      }
    }


    return this.composeClient.executeQuery(
      upsert_proposal_query,
      upsert_proposal_variables)
      .then(
        (value) =>
          new Promise((resolve, reject) => {
            if (value.errors) {
              reject(value.errors)
            } else {
              const response = value // as CreateNounishProfileResponse
              resolve(response); //.data.createNounishProfile.document);
            }
          })
      )
  }


  public async writeProposal(proposal: any): Promise<any> {
    if (!this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        reject("Must authenticate before calling writeAuthenticatedNounishProfile")
      })
    }

    const create_proposal_query = `
    mutation CreateNounsProposal($proposal: CreateNounsProposalInput!) {
      createNounsProposal(input: $proposal) {
          document {
            abstainVotes
            againstVotes
            calldatas
            createdBlock
            createdTimestamp
            createdTransaction
            description
            endBlock
            forVotes
            proposal_id
            proposalThreshold
            proposer
            quorumCoefficient
            quorumVotes
            signatures
            startBlock
            status
            targets
            totalSupply
            values
            daoName
          }
        }
    }`

    const create_proposal_variables = {
      "proposal": {
        "content": proposal
      }
    }

    return this.composeClient.executeQuery(
      create_proposal_query,
      create_proposal_variables)
      .then(
        (value) =>
          new Promise((resolve, reject) => {
            if (value.errors) {
              reject(value.errors)
            } else {
              const response = value // as CreateNounishProfileResponse
              resolve(response); //.data.createNounishProfile.document);
            }
          })
      )
  }


  // PROP HOUSE
  public getCeramicProphouseProposals(): Promise<ExecutionResult<any>> {
    return this.composeClient.executeQuery(QUERY_GET_PROPHOUSE_PROPOSALS)
  }

  public async getCeramicProphouseProposalsPaginated(): Promise<any> {
    const step: Number = 50

    let query = QUERY_GET_PROPHOUSE_PROPOSALS_PAGINATED_FIRST
    query = query.replace('INT_FIRST', step + "")

    let pageInfo: any = {
      'hasNextPage': false
    }

    // TODO: Append to result vector
    let counter = 0

    do {

      let page = await this.composeClient.executeQuery(query)

      console.log(JSON.stringify(page))

      pageInfo = page!['data']!['prophouseProposalIndex']
      pageInfo = pageInfo['pageInfo']

      query = QUERY_GET_PROPHOUSE_PROPOSALS_PAGINATED_FIRST_AFTER
      query = query.replace('INT_FIRST', step + "")
      query = query.replace('STRING_AFTER', pageInfo['endCursor'])

      counter += 1
      console.log('- ' + pageInfo['hasNextPage'])

      // Todo append page to result list
    } while(pageInfo['hasNextPage'])

    return counter
  }


  public async writeProphouseProposal(proposal: any): Promise<any> {
    if (!this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        reject("Must authenticate")
      })
    }

    const create_prophouse_proposal_query = `
    mutation CreateProphouseProposal($proposal: CreateProphouseProposalInput!) {
      createProphouseProposal(input: $proposal) {
          document {
            proposal_id
            contractAddress
            title
            what
            tldr
            voteCount
          }
        }
    }`

    const create_prophouse_proposal_variables = {
      "proposal": {
        "content": proposal
      }
    }

    return this.composeClient.executeQuery(
      create_prophouse_proposal_query,
      create_prophouse_proposal_variables)
      .then(
        (value) =>
          new Promise((resolve, reject) => {
            if (value.errors) {
              reject(value.errors)
            } else {
              const response = value // as CreateNounishProfileResponse
              resolve(response); //.data.createNounishProfile.document);
            }
          })
      )
  }

public async upsertProphouseProposal(ceramicId: any, proposal: any) {
    const upsert_proposal_query = `
      mutation UpdateProphouseProposal($proposal: UpdateProphouseProposalInput!) {
        updateProphouseProposal(input: $proposal) {
          document{ 
            proposal_id
            contractAddress
            title
            what
            tldr
            voteCount
          }
        }
      }`

    const upsert_proposal_variables = {
      "proposal": {
        "id": ceramicId,
        "content": proposal
      }
    }


    return this.composeClient.executeQuery(
      upsert_proposal_query,
      upsert_proposal_variables)
      .then(
        (value) =>
          new Promise((resolve, reject) => {
            if (value.errors) {
              reject(value.errors)
            } else {
              const response = value // as CreateNounishProfileResponse
              resolve(response); //.data.createNounishProfile.document);
            }
          })
      )
  }


  public getCeramicProposalVotes(): Promise<ExecutionResult<any>> {
    return this.composeClient.executeQuery(QUERY_GET_PROPOSAL_VOTES)
  }

  // TODO: untested
  public async writeProposalVote(vote: any): Promise<any> {
    if (!this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        reject("Must authenticate before calling writeAuthenticatedNounishProfile")
      })
    }

    const create_vote_query = `
    mutation CreateNounsProposalVote($vote: CreateNounsProposalVoteInput!) {
      createNounsProposalVote(input: $vote) {
          document {
            proposal_stream_id
            eth_address
            blocknumber
            vote_id
            reason
            support
            supportDetailed
            votes
            votesRaw
          }
        }
    }`

    const create_vote_variables = {
      "vote": {
        "content": vote
      }
    }

    return this.composeClient.executeQuery(
      create_vote_query,
      create_vote_variables)
      .then(
        (value) =>
          new Promise((resolve, reject) => {
            if (value.errors) {
              reject(value.errors)
            } else {
              const response = value // as CreateNounishProfileResponse
              resolve(response); //.data.createNounishProfile.document);
            }
          })
      ).catch((e) => console.log(JSON.stringify(e)))
  }


  // TODO: insertProposalVote, upsertProposalVote
}
