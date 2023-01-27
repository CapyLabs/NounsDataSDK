var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ComposeClient } from "@composedb/client";
import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";
import { QUERY_GET_NOUNISH_PROFILES, QUERY_GET_PROPOSALS } from "./queries.js";
import { definition } from "./__generated__/definition.js";
export class NounsDataClient {
    constructor() {
        this.composeClient = new ComposeClient({
            ceramic: "https://nounsdata.wtf:7007",
            definition: definition
        });
    }
    authenticate(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = fromString(seed, "base16");
            const did = new DID({
                resolver: getResolver(),
                provider: new Ed25519Provider(key)
            });
            yield did.authenticate();
            this.composeClient.setDID(did);
        });
    }
    getNounishProfile() {
        return this.composeClient.executeQuery(QUERY_GET_NOUNISH_PROFILES);
    }
    getCeramicProposals() {
        return this.composeClient.executeQuery(QUERY_GET_PROPOSALS);
    }
    writeNounishProfile(profile) {
        return this.composeClient.executeQuery(`        
      mutation {
        createNounishProfile(input: {
          content: {
            eth_address: "${profile.eth_address}"
            discord_username: "${profile.discord_username}"
            proposal_category_preference: "${profile.proposal_category_preference}"
          }
        }) 
        {
          document {
            eth_address
            discord_username
            proposal_category_preference
          }
        }
      }`);
    }
    writeProposal(proposal) {
    }
}
