

import { Proposal, PropHouse, Vote, Profile } from './Models';
import { DataAPI, DataAPIImplementation } from './Adapters'

class NounsDataNetwork {
    private dataAPI: DataAPI;

    constructor() {
        this.dataAPI = new DataAPIImplementation();
    }

    async getProposals(): Promise<Proposal[]> {
        const proposals = await this.dataAPI.get("/proposals");
        return proposals;
    }

    async getPropHouse(id: number): Promise<PropHouse> {
        const propHouse = await this.dataAPI.get(`/prophouse/${id}`);
        return propHouse;
    }

    async getVotes(): Promise<Vote[]> {
        const votes = await this.dataAPI.get("/votes");
        return votes;
    }

    async setProfile(profile: Profile): Promise<void> {
        await this.dataAPI.post("/profile", profile);
    }
}