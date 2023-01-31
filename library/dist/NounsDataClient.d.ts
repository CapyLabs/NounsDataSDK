import { ComposeClient } from "@composedb/client";
import { ExecutionResult } from 'graphql';
import { NounishProfile } from "../model/NounishProfile.js";
export declare class NounsDataClient {
    composeClient: ComposeClient;
    constructor();
    isAuthenticated(): boolean;
    authenticate(seed: string): Promise<void>;
    getAuthenticatedNounishProfile(): Promise<NounishProfile>;
    writeAuthenticatedNounishProfile(profile: NounishProfile): Promise<NounishProfile>;
    writeProposal(proposal: any): Promise<any>;
    getCeramicProposals(): Promise<ExecutionResult<any>>;
}
