import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";
import { type DocumentNode, type ExecutionResult, type Source } from 'graphql';

import { QUERY_GET_VIEWER_NOUNISH_PROFILE, QUERY_GET_PROPOSALS, NounishProfileResponse, CreateNounishProfileResponse } from "./queries.js";
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


  public async writeProposal(proposal: any): Promise<any> {

  }
  
  // TODO: Test this call, use from importer
  /*public async writeProposal(proposal: any): Promise<any> {
    if (!this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        reject("Must authenticate before calling writeAuthenticatedNounishProfile")
      })
    }

    return this.composeClient.executeQuery(`        
      mutation {
        createNounsProposal(input: {
          content: {
            description: "${proposal.description}"
            state: "${proposal.state}"
            blocknumber: "${proposal.blocknumber}"
            proposal_id: "${proposal.proposal_id}"
            votes_for: "${proposal.votes_for}"
            votes_against: "${proposal.votes_against}"
            votes_abstain: "${proposal.votes_abstain}"
            created_timestamp: "${proposal.created_timestamp}"
          }
        }) 
        {
          document {
            description
            state
            blocknumber
            proposal_id
            votes_for
            votes_against
            votes_abstain
            created_timestamp
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
  }*/
}
