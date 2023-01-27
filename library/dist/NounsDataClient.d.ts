import { ComposeClient } from "@composedb/client";
import { type ExecutionResult } from 'graphql';
import { NounishProfile } from "../model/NounishProfile.js";
export declare class NounsDataClient {
    composeClient: ComposeClient;
    constructor();
    isAuthenticated(): boolean;
    authenticate(seed: string): Promise<void>;
    getAuthenticatedNounishProfile(): Promise<NounishProfile>;
    writeNounishProfile(profile: NounishProfile): Promise<NounishProfile>;
    getCeramicProposals(): Promise<ExecutionResult<any>>;
    writeProposal(proposal: any): void;
}
