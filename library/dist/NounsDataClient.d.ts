import { ComposeClient } from "@composedb/client";
import { type ExecutionResult } from 'graphql';
import { NounishProfile } from "../model/NounishProfile.js";
export declare class NounsDataClient {
    composeClient: ComposeClient;
    constructor();
    authenticate(seed: string): Promise<void>;
    getNounishProfile(): Promise<ExecutionResult<any>>;
    getCeramicProposals(): Promise<ExecutionResult<any>>;
    writeNounishProfile(profile: NounishProfile): Promise<ExecutionResult<Record<string, unknown>, import("graphql/jsutils/ObjMap.js").ObjMap<unknown>>>;
    writeProposal(proposal: any): void;
}
