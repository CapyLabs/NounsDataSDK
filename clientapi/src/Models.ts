
export class Proposal {
    id: number;
    description: string;
    votesFor: number;
    votesAgainst: number;

    constructor(id: number, description: string, votesFor: number, votesAgainst: number) {
        this.id = id;
        this.description = description;
        this.votesFor = votesFor;
        this.votesAgainst = votesAgainst;
    }
}

export class PropHouse {
	constructor() {}
}

export class Vote {
	constructor() {}
}

export class Profile {
	constructor() {}
}
