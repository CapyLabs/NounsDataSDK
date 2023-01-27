import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";
import { type DocumentNode, type ExecutionResult, type Source } from 'graphql';

import { QUERY_GET_NOUNISH_PROFILES, QUERY_GET_PROPOSALS } from "./queries.js";
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

  public getNounishProfile(): Promise<ExecutionResult<any>> {//: Promise<ExecutionResult<Data>>
    return this.composeClient.executeQuery(QUERY_GET_NOUNISH_PROFILES);
  }

  public getCeramicProposals(): Promise<ExecutionResult<any>> {
    return this.composeClient.executeQuery(QUERY_GET_PROPOSALS)
  }

  public writeNounishProfile(profile: NounishProfile) {
    // TODO: Use relay.dev
    return this.composeClient.executeQuery(`        
         mutation {
            createNounishProfile(input: {
              content: {
                discord_username: "aaas 25522bore",
                proposal_category_preference: "treasuries"
                eth_address: "0xbabababababababababababababababababababa"
              }
            }) 
            {
              document {
                discord_username
                proposal_category_preference
              }
            }
          }`)
  }

  public writeProposal(proposal: any) {

  }
}
